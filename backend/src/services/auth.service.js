import bcrypt from "bcryptjs";
import { redis } from "../config/redis.js";
import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";
import { hashValue, randomToken } from "../utils/crypto.js";
import { addThreatEvent, isLocalDevIp } from "./threat.service.js";
import {
  assertRefreshTokenUsable,
  issueRefreshToken,
  lookupRefreshTokenRecord,
  revokeRefreshTokenByHash,
  revokeTokenFamily,
  rotateRefreshToken,
  signAccessToken,
  verifyRefreshTokenJwt,
} from "./token.service.js";
import {
  clearAuthAttemptState,
  recordFailedAuthAttempt,
  revokeSessionFamily,
  upsertSessionBinding,
} from "./security-state.service.js";
import { mergeGuestCartIntoUser } from "./cart.service.js";
import { mergeGuestWishlistIntoUser } from "./wishlist.service.js";
import { incrementFailedLoginMetric } from "../config/metrics.js";
import { assertNotGloballyLocked, getGlobalLockoutState } from "./admin-control.service.js";
import { isAdminSurfaceRole } from "../config/constants.js";
import {
  notifySecurityEscalation,
  sendPasswordResetCompletedNotification,
  sendPasswordResetRequestedNotification,
} from "./notification.service.js";
import { writeAuditLog } from "./audit.service.js";

const normalizeEmail = (email) => email.toLowerCase().trim();
const passwordResetWindowMs = env.PASSWORD_RESET_TTL_MINUTES * 60 * 1000;

const buildPasswordResetUrl = (token) => new URL(`/reset-password/${token}`, env.STORE_APP_URL).toString();

const getPasswordResetRecord = async (token) =>
  prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashValue(token) },
    include: { user: true },
  });

const assertPasswordResetRecordUsable = async ({ req, token, record }) => {
  if (!record || !record.user || !record.user.isActive || record.usedAt || record.expiresAt <= new Date()) {
    await addThreatEvent({
      req,
      userId: record?.userId ?? null,
      eventType: "invalid_password_reset_token",
      details: {
        tokenPrefix: token.slice(0, 12),
      },
    });
    throw new AppError("Reset link is invalid or expired.", 400, "RESET_TOKEN_INVALID");
  }
};

export const registerUser = async ({ email, password, name, phone }) => {
  await assertNotGloballyLocked();
  const existing = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
  if (existing) {
    if (!existing.passwordHash) {
      throw new AppError("Account already exists with Google/Instagram. Please login using that provider.", 409, "OAUTH_ACCOUNT_EXISTS");
    }
    throw new AppError("Account already exists. Please login with your password.", 409, "EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: normalizeEmail(email),
      passwordHash,
      name,
      phone,
      isEmailVerified: false,
    },
  });

  const verifyToken = randomToken(32);
  await redis.set(`email-verify:${verifyToken}`, user.email, "EX", 86400); // 24 hours
  console.log(`\n\n[MOCK EMAIL] Verification link for ${user.email}: http://localhost:3000/verify-email?token=${verifyToken}\n\n`);

  loggers.security.info({
    eventType: "registration_success",
    userId: user.id,
    details: { email: user.email },
  });

  return user;
};

const lockAccountIfNeeded = async (user) => {
  const failedAttempts = user.failedLoginAttempts + 1;
  const shouldLock = failedAttempts >= 5;
  const lockedUntil = shouldLock
    ? new Date(Date.now() + env.ACCOUNT_LOCK_MINUTES * 60 * 1000)
    : null;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: failedAttempts,
      lockedUntil,
    },
  });
  await redis.del(`user-cache:${user.id}`);
};

const assertAccountNotLocked = (user) => {
  if (!user) return;
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError("Account is temporarily locked.", 423, "ACCOUNT_LOCKED");
  }
};

const applyAuthAttemptEscalation = async ({ req, user, attemptState, email }) => {
  if (attemptState.accountLockTriggered && user?.id) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lockedUntil: new Date(Date.now() + env.ACCOUNT_LOCK_MINUTES * 60 * 1000),
        failedLoginAttempts: Math.max(5, user.failedLoginAttempts + 1),
      },
    });
    await redis.del(`user-cache:${user.id}`);
  }

  if (attemptState.ipBlockTriggered && attemptState.blockedUntil && !isLocalDevIp(attemptState.ip)) {
    await prisma.iPBlock.upsert({
      where: { ip: attemptState.ip },
      create: {
        ip: attemptState.ip,
        blockedUntil: attemptState.blockedUntil,
        reason: `Credential stuffing threshold reached for IP ${attemptState.ip}`,
      },
      update: {
        blockedUntil: attemptState.blockedUntil,
        reason: `Credential stuffing threshold reached for IP ${attemptState.ip}`,
      },
    });
  }

  if (attemptState.accountLockTriggered || attemptState.ipBlockTriggered) {
    await addThreatEvent({
      req,
      userId: user?.id ?? null,
      eventType: "credential_stuffing_threshold_reached",
      details: {
        email,
        ip: attemptState.ip,
        ipCount: attemptState.ipCount,
        accountIpCount: attemptState.accountIpCount,
        accountLockTriggered: attemptState.accountLockTriggered,
        ipBlockTriggered: attemptState.ipBlockTriggered,
      },
    });
  }
};

export const loginUser = async ({ req, email, password, deviceId }) => {
  const normalized = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  const lockoutState = await getGlobalLockoutState();
  if (lockoutState.locked && !isAdminSurfaceRole(user?.role)) {
    throw new AppError("Platform is in emergency lockout mode.", 423, "GLOBAL_LOCKOUT_ACTIVE");
  }

  if (!user) {
    incrementFailedLoginMetric();
    const attemptState = await recordFailedAuthAttempt({
      email: normalized,
      ip: req.ip,
    });
    await applyAuthAttemptEscalation({
      req,
      user: null,
      attemptState: { ...attemptState, ip: req.ip },
      email: normalized,
    });

    await addThreatEvent({
      req,
      eventType: "failed_login_unknown_email",
      details: { email: normalized },
    });
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  assertAccountNotLocked(user);
  if (!user.isActive) throw new AppError("Account is inactive.", 403, "ACCOUNT_INACTIVE");
  if (!user.isEmailVerified) throw new AppError("Please verify your email before logging in.", 403, "EMAIL_NOT_VERIFIED");

  if (!user.passwordHash) {
    throw new AppError("Please login with Google/Instagram or reset your password.", 401, "OAUTH_USER_NO_PASSWORD");
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    incrementFailedLoginMetric();
    await lockAccountIfNeeded(user);
    const attemptState = await recordFailedAuthAttempt({
      userId: user.id,
      email: normalized,
      ip: req.ip,
    });
    await applyAuthAttemptEscalation({
      req,
      user,
      attemptState: { ...attemptState, ip: req.ip },
      email: normalized,
    });

    await addThreatEvent({
      req,
      userId: user.id,
      eventType: "failed_login_password_mismatch",
      details: {},
    });
    throw new AppError("Invalid credentials.", 401, "INVALID_CREDENTIALS");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
  await redis.del(`user-cache:${user.id}`);
  await clearAuthAttemptState({ email: normalized, ip: req.ip });

  const refreshIssue = await issueRefreshToken({
    userId: user.id,
    role: user.role,
    deviceId,
    ip: req.ip,
  });
  await upsertSessionBinding({
    userId: user.id,
    familyId: refreshIssue.familyId,
    deviceIdHash: hashValue(deviceId),
    req,
  });

  const accessIssue = signAccessToken({
    user,
    familyId: refreshIssue.familyId,
  });

  await mergeGuestCartIntoUser(req, user.id);
  await mergeGuestWishlistIntoUser(req, user.id);

  loggers.security.info({
    eventType: "login_success",
    userId: user.id,
    details: { deviceIdHashPrefix: deviceId.slice(0, 8), refreshFamilyId: refreshIssue.familyId },
  });

  if (isAdminSurfaceRole(user.role)) {
    await writeAuditLog({
      req,
      actorId: user.id,
      action: "ADMIN_LOGIN_SUCCESS",
      targetType: "USER",
      targetId: user.id,
      details: {
        role: user.role,
        deviceIdHashPrefix: deviceId.slice(0, 8),
        refreshFamilyId: refreshIssue.familyId,
      },
    });

    await notifySecurityEscalation({
      eventType: "ADMIN_LOGIN_SUCCESS",
      severity: "ERROR",
      message: `Admin login succeeded for ${user.email}`,
      details: {
        userId: user.id,
        role: user.role,
        ip: req.ip,
        userAgent: req.get?.("user-agent") ?? null,
      },
    });
  }

  return {
    user,
    accessToken: accessIssue.token,
    refreshToken: refreshIssue.refreshToken,
    accessTokenExpiresAt: accessIssue.expiresAt,
    accessTokenJti: accessIssue.jti,
    refreshFamilyId: refreshIssue.familyId,
  };
};

export const refreshSession = async ({ req, refreshToken, deviceId }) => {
  let payload;
  try {
    payload = verifyRefreshTokenJwt(refreshToken);
  } catch {
    await addThreatEvent({
      req,
      eventType: "invalid_refresh_token_signature",
      details: {},
    });
    throw new AppError("Invalid refresh token.", 401, "INVALID_REFRESH_TOKEN");
  }

  const tokenRecord = await lookupRefreshTokenRecord(refreshToken);
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });
  if (!user) throw new AppError("User not found.", 401, "USER_NOT_FOUND");
  const lockoutState = await getGlobalLockoutState();
  if (lockoutState.locked && !isAdminSurfaceRole(user.role)) {
    throw new AppError("Platform is in emergency lockout mode.", 423, "GLOBAL_LOCKOUT_ACTIVE");
  }

  try {
    assertRefreshTokenUsable({ tokenRecord, payload, deviceId });
  } catch (error) {
    await revokeTokenFamily(payload.familyId, "Refresh token reuse/device mismatch.");
    await revokeSessionFamily({
      userId: user.id,
      familyId: payload.familyId,
      reason: "Refresh token reuse/device mismatch.",
    });
    await addThreatEvent({
      req,
      userId: user.id,
      eventType: "refresh_token_reuse_detected",
      details: { familyId: payload.familyId, reason: error.code },
    });
    throw error;
  }

  const rotated = await rotateRefreshToken({
    currentToken: refreshToken,
    user,
    familyId: payload.familyId,
    tokenRecord,
    deviceId,
    ip: req.ip,
  });

  await upsertSessionBinding({
    userId: user.id,
    familyId: payload.familyId,
    deviceIdHash: hashValue(deviceId),
    req,
  });

  const accessIssue = signAccessToken({ user, familyId: payload.familyId });

  return {
    accessToken: accessIssue.token,
    refreshToken: rotated.refreshToken,
    accessTokenExpiresAt: accessIssue.expiresAt,
    accessTokenJti: accessIssue.jti,
    refreshFamilyId: payload.familyId,
  };
};

export const logoutUser = async ({ refreshToken }) => {
  if (!refreshToken) return;
  const tokenRecord = await lookupRefreshTokenRecord(refreshToken);
  if (tokenRecord) {
    await revokeSessionFamily({
      userId: tokenRecord.userId,
      familyId: tokenRecord.familyId,
      reason: "User logout",
    });
  }
  await revokeRefreshTokenByHash(refreshToken, "User logout");
};

export const requestPasswordReset = async ({ req, email }) => {
  const normalized = normalizeEmail(email);
  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: {
      id: true,
      email: true,
      name: true,
      isActive: true,
      role: true,
    },
  });

  if (!user || !user.isActive) {
    loggers.security.info({
      eventType: "password_reset_request_accepted",
      userId: user?.id ?? null,
      details: { email: normalized, delivered: false },
    });
    return;
  }

  const rawToken = randomToken(32);
  const expiresAt = new Date(Date.now() + passwordResetWindowMs);

  const tokenRecord = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashValue(rawToken),
      expiresAt,
      createdByIp: req.ip,
    },
  });

  const deliveryStatus = await sendPasswordResetRequestedNotification({
    recipient: user,
    resetUrl: buildPasswordResetUrl(rawToken),
    expiresInMinutes: env.PASSWORD_RESET_TTL_MINUTES,
  });

  if (deliveryStatus !== "SENT") {
    await prisma.passwordResetToken.delete({
      where: { id: tokenRecord.id },
    });

    loggers.security.warn({
      eventType: "password_reset_request_delivery_blocked",
      userId: user.id,
      details: {
        email: user.email,
        deliveryStatus,
      },
    });
    return;
  }

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
      usedAt: null,
      id: { not: tokenRecord.id },
    },
  });

  loggers.security.info({
    eventType: "password_reset_request_accepted",
    userId: user.id,
    details: {
      email: user.email,
      expiresAt: expiresAt.toISOString(),
      delivered: true,
    },
  });
};

export const validatePasswordResetToken = async ({ req, token }) => {
  const record = await getPasswordResetRecord(token);
  await assertPasswordResetRecordUsable({ req, token, record });

  return {
    expiresAt: record.expiresAt,
  };
};

export const resetPasswordWithToken = async ({ req, token, password }) => {
  const record = await getPasswordResetRecord(token);
  await assertPasswordResetRecordUsable({ req, token, record });

  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: record.userId },
      data: {
        passwordHash,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    await tx.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: now },
    });

    await tx.passwordResetToken.deleteMany({
      where: {
        userId: record.userId,
        id: { not: record.id },
      },
    });

    await tx.refreshToken.updateMany({
      where: {
        userId: record.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
        revocationReason: "Password reset completed",
      },
    });

    await tx.sessionBinding.updateMany({
      where: {
        userId: record.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    });
  });

  await addThreatEvent({
    req,
    userId: record.userId,
    eventType: "password_reset_completed",
    details: {},
  });

  await writeAuditLog({
    req,
    actorId: record.userId,
    action: "PASSWORD_RESET_COMPLETED",
    targetType: "AUTH",
    targetId: record.userId,
    details: {
      resetTokenId: record.id,
    },
  });

  await sendPasswordResetCompletedNotification({
    recipient: {
      id: record.user.id,
      email: record.user.email,
      name: record.user.name,
      phone: record.user.phone,
    },
  });

  loggers.security.info({
    eventType: "password_reset_completed",
    userId: record.userId,
    details: {},
  });
};

export const loginWithOAuth = async ({ req, email, name, provider, providerId, deviceId }) => {
  const normalized = normalizeEmail(email);
  const lockoutState = await getGlobalLockoutState();
  if (lockoutState.locked) {
    throw new AppError("Platform is in emergency lockout mode.", 423, "GLOBAL_LOCKOUT_ACTIVE");
  }

  let user = await prisma.user.findUnique({ where: { email: normalized } });

  if (user) {
    assertAccountNotLocked(user);
    if (!user.isActive) throw new AppError("Account is inactive.", 403, "ACCOUNT_INACTIVE");
    
    // Strict Boundary Check
    if (provider === "google" && !user.googleId) {
      throw new AppError("Account already exists. Please login with your password.", 409, "ACCOUNT_EXISTS_DIFFERENT_PROVIDER");
    } else if (provider === "instagram" && !user.instagramId) {
      throw new AppError("Account already exists. Please login with your password.", 409, "ACCOUNT_EXISTS_DIFFERENT_PROVIDER");
    }
    
    // If they bypass somehow but IDs match, proceed normally.
  } else {
    // Auto-Registration
    user = await prisma.user.create({
      data: {
        email: normalized,
        name: name || email.split("@")[0],
        passwordHash: null,
        googleId: provider === "google" ? providerId : null,
        instagramId: provider === "instagram" ? providerId : null,
        role: "CUSTOMER"
      }
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });
  await redis.del(`user-cache:${user.id}`);
  await clearAuthAttemptState({ email: normalized, ip: req.ip });

  const refreshIssue = await issueRefreshToken({
    userId: user.id,
    role: user.role,
    deviceId,
    ip: req.ip,
  });

  await upsertSessionBinding({
    userId: user.id,
    familyId: refreshIssue.familyId,
    deviceIdHash: hashValue(deviceId),
    req,
  });

  const accessIssue = signAccessToken({
    user,
    familyId: refreshIssue.familyId,
  });

  await addThreatEvent({
    req,
    eventType: "oauth_login_success",
    userId: user.id,
    details: { provider, deviceIdHashPrefix: deviceId.slice(0, 8), refreshFamilyId: refreshIssue.familyId },
  });

  if (isAdminSurfaceRole(user.role)) {
    await writeAuditLog({
      req,
      actorId: user.id,
      action: "ADMIN_OAUTH_LOGIN_SUCCESS",
      targetType: "USER",
      targetId: user.id,
      details: { role: user.role, provider },
    });
    await notifySecurityEscalation({
      eventType: "ADMIN_OAUTH_LOGIN_SUCCESS",
      severity: "ERROR",
      message: `Admin OAuth login succeeded for ${user.email} via ${provider}`,
      details: { userId: user.id, role: user.role, ip: req.ip },
    });
  }

  return {
    user,
    accessToken: accessIssue.token,
    accessTokenExpiresAt: accessIssue.expiresAt,
    refreshToken: refreshIssue.refreshToken,
  };
};
export const verifyEmail = async (token) => {
  const email = await redis.get(`email-verify:${token}`);
  if (!email) throw new AppError("Invalid or expired verification link.", 400, "VERIFY_TOKEN_INVALID");
  await prisma.user.update({
    where: { email },
    data: { isEmailVerified: true },
  });
  await redis.del(`email-verify:${token}`);
};
