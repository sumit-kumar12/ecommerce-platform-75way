import { env } from "../config/env.js";
import { redis } from "../config/redis.js";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { updateRequestContext } from "../config/request-context.js";
import { AppError } from "../errors/app-error.js";
import { hashValue } from "../utils/crypto.js";
import {
  getSessionBinding,
  isAccessTokenRevoked,
  markAccessTokenRevoked,
  markAccessTokenSeen,
  revokeSessionFamily,
} from "../services/security-state.service.js";
import { verifyAccessToken } from "../services/token.service.js";

const getAccessTokenFromRequest = (req) => {
  const header = req.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  const cookieToken = req.cookies[env.ACCESS_COOKIE_NAME];
  console.log("JWT Middleware check -> Path:", req.path, "Cookies:", Object.keys(req.cookies || {}), "Token found:", !!cookieToken);
  if (cookieToken) return cookieToken;
  return null;
};

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const jwtVerificationMiddleware = async (req, _res, next) => {
  const token = getAccessTokenFromRequest(req);
  req.user = null;
  if (!token) {
    console.log("[JWT] No token found in request to", req.originalUrl, "Headers:", req.headers.cookie);
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    if (!decoded?.jti) throw new AppError("Access token missing jti.", 401, "ACCESS_TOKEN_INVALID");

    const pipeline = redis.pipeline();
    pipeline.get(`ip-block:${req.ip}`);
    pipeline.get(`token-revoked:${decoded.jti}`);
    const results = await pipeline.exec();

    if (results[0][1]) throw new AppError("IP address blocked.", 403, "IP_BLOCKED");
    
    let revoked = results[1][1];
    if (!revoked) {
       revoked = await isAccessTokenRevoked(decoded.jti);
    }
    if (revoked) throw new AppError("Access token revoked.", 401, "ACCESS_TOKEN_REVOKED");

    if (decoded.sid) {
      const binding = await getSessionBinding({ userId: decoded.sub, familyId: decoded.sid });
      if (!binding || binding.revokedAt) {
        throw new AppError("Session binding invalid.", 401, "SESSION_BINDING_INVALID");
      }

      if (!SAFE_METHODS.has(req.method) && env.SESSION_BINDING_STRICT_DEVICE) {
        const deviceId = req.get("x-device-id");
        if (!deviceId || hashValue(deviceId) !== binding.deviceIdHash) {
          await markAccessTokenRevoked({
            jti: decoded.jti,
            userId: decoded.sub,
            familyId: decoded.sid,
            reason: "Device fingerprint mismatch",
            expiresAt: new Date(decoded.exp * 1000),
          });
          await revokeSessionFamily({
            userId: decoded.sub,
            familyId: decoded.sid,
            reason: "Device fingerprint mismatch",
          });
          throw new AppError("Session device mismatch.", 401, "SESSION_DEVICE_MISMATCH");
        }
      }
    }

    const replayState = await markAccessTokenSeen({
      jti: decoded.jti,
      req,
      expiresAt: new Date(decoded.exp * 1000),
    });
    if (replayState.replayDetected) {
      await markAccessTokenRevoked({
        jti: decoded.jti,
        userId: decoded.sub,
        familyId: decoded.sid ?? null,
        reason: "Access token replay detected across fingerprints",
        expiresAt: new Date(decoded.exp * 1000),
      });
      if (decoded.sid) {
        await revokeSessionFamily({
          userId: decoded.sub,
          familyId: decoded.sid,
          reason: "Access token replay detected across fingerprints",
        });
      }
      throw new AppError("Access token replay detected.", 401, "ACCESS_TOKEN_REPLAY_DETECTED");
    }

    const cacheKey = `user-cache:${decoded.sub}`;
    const cachedUser = await redis.get(cacheKey);
    let user;
    
    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await prisma.user.findUnique({
        where: { id: decoded.sub },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          lockedUntil: true,
        },
      });
      if (user) {
        await redis.setex(cacheKey, 30, JSON.stringify(user));
      }
    }
    if (!user) {
      return next(new AppError("Account no longer exists.", 401, "USER_NOT_FOUND"));
    }
    req.user = user;
    updateRequestContext({ userId: user.id });
    return next();
  } catch (error) {
    loggers.security.warn({
      eventType: "jwt_verification_failed",
      details: { message: error.message, path: req.originalUrl, method: req.method },
    });
    req.user = null;
    return next();
  }
};

export const requireAuthenticatedUserMiddleware = (req, _res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication required.", 401, "AUTH_REQUIRED"));
  }
  return next();
};

export const resolveSseTokenMiddleware = async (req, res, next) => {
  try {
    const sseToken = req.query?.sseToken;
    if (!sseToken) return next();
    
    const userId = await redis.get(`sse:${sseToken}`);
    if (!userId) {
      return next(new AppError("SSE token expired or invalid.", 401, "SSE_TOKEN_EXPIRED"));
    }
    
    await redis.del(`sse:${sseToken}`);
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next(new AppError("Account no longer exists.", 401, "USER_NOT_FOUND"));
    }
    
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
