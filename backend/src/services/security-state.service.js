import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { hashValue } from "../utils/crypto.js";

const authWindowSeconds = env.AUTH_ATTEMPT_WINDOW_MINUTES * 60;

const tokenReplayKey = (jti) => `access_token_jti:${jti}`;
const tokenRevokedKey = (jti) => `access_token_revoked:${jti}`;
const authIpKey = (ip) => `auth_attempt_ip:${ip}`;
const authAccountIpKey = (email, ip) => `auth_attempt_account_ip:${hashValue(email)}:${ip}`;

const toUserAgentHash = (userAgent) => hashValue(userAgent ?? "unknown");

const upsertAuthCounter = async ({ subjectKey, userId, ip, email, blockedUntil, count }) => {
  const existing = await prisma.authAttemptCounter.findUnique({ where: { subjectKey } });
  if (existing) {
    await prisma.authAttemptCounter.update({
      where: { subjectKey },
      data: {
        userId: userId ?? existing.userId,
        ip,
        email,
        failedCount: count,
        blockedUntil,
      },
    });
    return;
  }

  await prisma.authAttemptCounter.create({
    data: {
      subjectKey,
      userId,
      ip,
      email,
      failedCount: count,
      blockedUntil,
    },
  });
};

export const recordFailedAuthAttempt = async ({ userId = null, email, ip }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const [ipCount, accountIpCount] = await Promise.all([
    redis.incr(authIpKey(ip)),
    redis.incr(authAccountIpKey(normalizedEmail, ip)),
  ]);

  const [ipTtl, accountTtl] = await Promise.all([
    redis.ttl(authIpKey(ip)),
    redis.ttl(authAccountIpKey(normalizedEmail, ip)),
  ]);

  if (ipTtl < 0) await redis.expire(authIpKey(ip), authWindowSeconds);
  if (accountTtl < 0) await redis.expire(authAccountIpKey(normalizedEmail, ip), authWindowSeconds);

  const accountLockTriggered = accountIpCount >= env.AUTH_ATTEMPT_MAX_PER_ACCOUNT_IP;
  const ipBlockTriggered = ipCount >= env.AUTH_ATTEMPT_MAX_PER_IP;
  const now = Date.now();
  const blockedUntil = ipBlockTriggered
    ? new Date(now + env.IP_BLOCK_MINUTES * 60 * 1000)
    : accountLockTriggered
      ? new Date(now + env.ACCOUNT_LOCK_MINUTES * 60 * 1000)
      : null;

  await Promise.all([
    upsertAuthCounter({
      subjectKey: `ip:${ip}`,
      userId,
      ip,
      email: normalizedEmail,
      blockedUntil: ipBlockTriggered ? blockedUntil : null,
      count: ipCount,
    }),
    upsertAuthCounter({
      subjectKey: `email_ip:${normalizedEmail}:${ip}`,
      userId,
      ip,
      email: normalizedEmail,
      blockedUntil,
      count: accountIpCount,
    }),
  ]);

  return {
    ipCount,
    accountIpCount,
    accountLockTriggered,
    ipBlockTriggered,
    blockedUntil,
  };
};

export const clearAuthAttemptState = async ({ email, ip }) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  await Promise.all([
    redis.del(authIpKey(ip)),
    redis.del(authAccountIpKey(normalizedEmail, ip)),
    prisma.authAttemptCounter.deleteMany({
      where: {
        OR: [
          { subjectKey: `ip:${ip}` },
          { subjectKey: `email_ip:${normalizedEmail}:${ip}` },
        ],
      },
    }),
  ]);
};

export const markAccessTokenSeen = async ({ jti, req, expiresAt }) => {
  const key = tokenReplayKey(jti);
  // Next.js SSR uses different user-agents (e.g. node-fetch/Next.js). Bypass strict UA check if local proxy.
  const isLocalProxy = req.ip === "127.0.0.1" || req.ip === "::1" || req.ip === "::ffff:127.0.0.1";
  const uaHash = isLocalProxy ? "local-proxy" : toUserAgentHash(req.get("user-agent"));
  const fingerprint = `${req.ip}|${uaHash}`;
  const ttlSeconds = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));

  const existing = await redis.get(key);
  if (!existing) {
    await redis.set(key, fingerprint, "EX", ttlSeconds);
    return { replayDetected: false };
  }

  if (existing !== fingerprint) {
    // If it was originally local-proxy, and now a real browser from same IP, allow it.
    if (isLocalProxy && (existing === `${req.ip}|local-proxy` || fingerprint === `${req.ip}|local-proxy`)) {
      return { replayDetected: false };
    }
    return { replayDetected: true, existingFingerprint: existing, currentFingerprint: fingerprint };
  }

  return { replayDetected: false };
};

export const markAccessTokenRevoked = async ({ jti, userId, familyId = null, reason, expiresAt }) => {
  const ttlSeconds = Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  await redis.set(tokenRevokedKey(jti), reason, "EX", ttlSeconds);

  await prisma.accessTokenRevocation.upsert({
    where: { jti },
    create: {
      jti,
      userId,
      familyId,
      reason,
      expiresAt,
    },
    update: {
      reason,
      expiresAt,
    },
  });
};

export const isAccessTokenRevoked = async (jti) => {
  const cached = await redis.get(tokenRevokedKey(jti));
  if (cached) return true;

  const revoked = await prisma.accessTokenRevocation.findUnique({ where: { jti } });
  if (!revoked) return false;
  if (revoked.expiresAt <= new Date()) return false;
  return true;
};

export const upsertSessionBinding = async ({ userId, familyId, deviceIdHash, req }) => {
  const userAgentHash = toUserAgentHash(req.get("user-agent"));

  const existing = await prisma.sessionBinding.findUnique({
    where: {
      userId_familyId: {
        userId,
        familyId,
      },
    },
  });

  if (existing) {
    return prisma.sessionBinding.update({
      where: {
        userId_familyId: {
          userId,
          familyId,
        },
      },
      data: {
        lastSeenIp: req.ip,
        lastSeenUserAgentHash: userAgentHash,
        lastSeenAt: new Date(),
        revokedAt: null,
      },
    });
  }

  return prisma.sessionBinding.create({
    data: {
      userId,
      familyId,
      deviceIdHash,
      initialIp: req.ip,
      initialUserAgentHash: userAgentHash,
      lastSeenIp: req.ip,
      lastSeenUserAgentHash: userAgentHash,
      lastSeenAt: new Date(),
    },
  });
};

export const revokeSessionFamily = async ({ userId, familyId, reason }) => {
  await prisma.sessionBinding.updateMany({
    where: { userId, familyId, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  await prisma.refreshToken.updateMany({
    where: { userId, familyId, revokedAt: null },
    data: {
      revokedAt: new Date(),
      revocationReason: reason,
    },
  });
};

export const getSessionBinding = async ({ userId, familyId }) =>
  prisma.sessionBinding.findUnique({
    where: {
      userId_familyId: {
        userId,
        familyId,
      },
    },
  });
