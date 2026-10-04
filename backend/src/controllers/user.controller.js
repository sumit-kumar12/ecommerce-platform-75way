import bcrypt from "bcryptjs";
import { z } from "zod";
import { env } from "../config/env.js";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { AppError } from "../errors/app-error.js";
import { sanitizeText } from "../utils/sanitize.js";
import { writeAuditLog } from "../services/audit.service.js";
import { revokeSessionFamily } from "../services/security-state.service.js";

// AUDIT B5 — Email is intentionally excluded from updateMeSchema.
// Only `name` and `phone` are accepted; email changes require a separate
// verified-email flow (not yet implemented). This prevents account hijacking
// via PATCH /me with a new email on a borrowed session.
const updateMeSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, "Phone must be a valid international number.")
    .nullable()
    .optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .max(128)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
});

export const getMeController = async (req, res) => {
  console.log("Headers in /me:", req.headers);
  console.log("Cookies received in /me:", req.cookies, req.headers.authorization, req.user);
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      role: true,
      isActive: true,
      failedLoginAttempts: true,
      lockedUntil: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");

  res.status(200).json({ user });
};

export const updateMeController = async (req, res) => {
  const input = updateMeSchema.parse(req.body);

  const updateData = {};
  if (input.name !== undefined) updateData.name = sanitizeText(input.name);
  if (input.phone !== undefined) {
    if (input.phone === null) {
      updateData.phone = null;
    } else {
      const sanitizedPhone = sanitizeText(input.phone);
      // Enforce phone uniqueness
      if (sanitizedPhone) {
        const existing = await prisma.user.findFirst({
          where: { phone: sanitizedPhone, id: { not: req.user.id } },
        });
        if (existing) {
          throw new AppError("Phone number is already in use.", 409, "PHONE_ALREADY_EXISTS");
        }
      }
      updateData.phone = sanitizedPhone || null;
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: "No valid fields to update.", code: "NO_UPDATE_FIELDS" });
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      role: true,
      isActive: true,
      updatedAt: true,
    },
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "PROFILE_UPDATE",
    targetType: "USER",
    targetId: req.user.id,
    details: { updatedFields: Object.keys(updateData) },
  });

  loggers.security.info({
    eventType: "profile_updated",
    userId: req.user.id,
    details: { updatedFields: Object.keys(updateData) },
  });

  return res.status(200).json({ user });
};

export const changePasswordController = async (req, res) => {
  const input = changePasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");

  const currentValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!currentValid) {
    loggers.security.warn({
      eventType: "change_password_wrong_current",
      userId: req.user.id,
      details: {},
    });
    throw new AppError("Current password is incorrect.", 401, "WRONG_CURRENT_PASSWORD");
  }

  const isSame = await bcrypt.compare(input.newPassword, user.passwordHash);
  if (isSame) {
    throw new AppError("New password must differ from current password.", 400, "PASSWORD_SAME_AS_CURRENT");
  }

  const newHash = await bcrypt.hash(input.newPassword, env.BCRYPT_SALT_ROUNDS);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: newHash },
  });
  await redis.del(`user-cache:${req.user.id}`);

  // Revoke all refresh token families to force re-login on other devices
  const families = await prisma.refreshToken.groupBy({
    by: ["familyId"],
    where: { userId: req.user.id, revokedAt: null },
  });

  for (const { familyId } of families) {
    await revokeSessionFamily({
      userId: req.user.id,
      familyId,
      reason: "Password changed — all sessions revoked",
    });
  }

  await prisma.refreshToken.updateMany({
    where: { userId: req.user.id, revokedAt: null },
    data: { revokedAt: new Date(), revocationReason: "Password changed" },
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "PASSWORD_CHANGE",
    targetType: "USER",
    targetId: req.user.id,
    details: { sessionsRevoked: families.length },
  });

  loggers.security.warn({
    eventType: "password_changed",
    userId: req.user.id,
    details: { sessionsRevoked: families.length },
  });

  res.status(200).json({ message: "Password changed. All other sessions have been revoked." });
};
