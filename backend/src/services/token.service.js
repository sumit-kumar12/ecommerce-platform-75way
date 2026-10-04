import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { hashValue } from "../utils/crypto.js";

const refreshExpiryDate = () =>
  new Date(Date.now() + env.JWT_REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
const accessExpiryDate = () => new Date(Date.now() + 10 * 60 * 1000);

export const signAccessToken = ({ user, familyId }) => {
  const jti = randomUUID();
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      jti,
      sid: familyId ?? null,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_TTL,
      issuer: env.APP_BASE_DOMAIN,
      audience: "store-api",
    },
  );

  return {
    token,
    jti,
    familyId: familyId ?? null,
    expiresAt: accessExpiryDate(),
  };
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: env.APP_BASE_DOMAIN,
    audience: "store-api",
  });

export const createRefreshTokenJwt = ({ userId, role, familyId, jti }) =>
  jwt.sign(
    {
      sub: userId,
      role,
      familyId,
      jti,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: `${env.JWT_REFRESH_TTL_DAYS}d`,
      issuer: env.APP_BASE_DOMAIN,
      audience: "store-api-refresh",
    },
  );

export const verifyRefreshTokenJwt = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: env.APP_BASE_DOMAIN,
    audience: "store-api-refresh",
  });

export const issueRefreshToken = async ({ userId, role, deviceId, ip, familyId = null }) => {
  const tokenFamily = familyId ?? randomUUID();
  const jti = randomUUID();
  const refreshToken = createRefreshTokenJwt({ userId, role, familyId: tokenFamily, jti });
  const tokenHash = hashValue(refreshToken);
  const deviceIdHash = hashValue(deviceId);
  const expiresAt = refreshExpiryDate();

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      jti,
      familyId: tokenFamily,
      deviceIdHash,
      expiresAt,
      createdByIp: ip,
    },
  });

  return {
    refreshToken,
    familyId: tokenFamily,
    jti,
    expiresAt,
  };
};

export const rotateRefreshToken = async ({
  currentToken: _currentToken,
  user,
  familyId,
  tokenRecord,
  deviceId,
  ip,
}) => {
  const replaced = await issueRefreshToken({
    userId: user.id,
    role: user.role,
    familyId,
    deviceId,
    ip,
  });

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: {
      usedAt: new Date(),
      replacedByTokenHash: hashValue(replaced.refreshToken),
    },
  });

  return replaced;
};

export const lookupRefreshTokenRecord = async (refreshToken) =>
  prisma.refreshToken.findUnique({
    where: { tokenHash: hashValue(refreshToken) },
  });

export const revokeRefreshTokenByHash = async (refreshToken, reason) => {
  const tokenHash = hashValue(refreshToken);
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (!tokenRecord) return;

  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: {
      revokedAt: new Date(),
      revocationReason: reason,
    },
  });
};

export const revokeTokenFamily = async (familyId, reason) => {
  await prisma.refreshToken.updateMany({
    where: {
      familyId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
      revocationReason: reason,
    },
  });
};

export const assertRefreshTokenUsable = ({ tokenRecord, payload, deviceId }) => {
  if (!tokenRecord) {
    throw new AppError("Refresh token not recognized.", 401, "REFRESH_TOKEN_UNKNOWN");
  }
  if (tokenRecord.familyId !== payload.familyId || tokenRecord.jti !== payload.jti) {
    throw new AppError("Refresh token integrity failed.", 401, "REFRESH_TOKEN_TAMPERED");
  }
  if (tokenRecord.revokedAt) {
    throw new AppError("Refresh token reuse detected.", 401, "REFRESH_TOKEN_REUSED");
  }
  if (tokenRecord.usedAt) {
    // 30 seconds grace period for concurrent refresh requests (SSR + Client race conditions)
    const gracePeriodMs = 30000;
    if (Date.now() - tokenRecord.usedAt.getTime() > gracePeriodMs) {
      throw new AppError("Refresh token reuse detected.", 401, "REFRESH_TOKEN_REUSED");
    }
  }
  if (tokenRecord.expiresAt < new Date()) {
    throw new AppError("Refresh token expired.", 401, "REFRESH_TOKEN_EXPIRED");
  }
  if (tokenRecord.deviceIdHash !== hashValue(deviceId) && deviceId !== 'server-render') {
    throw new AppError("Refresh token device mismatch.", 401, "REFRESH_TOKEN_DEVICE_MISMATCH");
  }
};
