/**
 * Local/admin reset helper.
 *
 * Creates exactly two active admin-surface accounts:
 * - platform/security admin: SECURITY_ADMIN
 * - merchant admin: COMMERCE_ADMIN
 *
 * Existing admin-surface users are removed after restricted ownership records are
 * reassigned to the correct replacement account.
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_SURFACE_ROLES = [
  "ADMIN",
  "SUPER_ADMIN",
  "SECURITY_ADMIN",
  "COMMERCE_ADMIN",
  "PRODUCT_LISTER",
  "SUPPORT_AGENT",
  "VIEWER",
];

const PLATFORM_ADMIN_EMAIL = process.env.SEED_PLATFORM_ADMIN_EMAIL || "platform@katabazaar.local";
const PLATFORM_ADMIN_PASSWORD = process.env.SEED_PLATFORM_ADMIN_PASSWORD || "Platform@Katabazaar#2026!Local";
const PLATFORM_ADMIN_NAME = process.env.SEED_PLATFORM_ADMIN_NAME || "Katabazaar Platform Administrator";
const MERCHANT_ADMIN_EMAIL = process.env.SEED_MERCHANT_ADMIN_EMAIL || "merchant@katabazaar.local";
const MERCHANT_ADMIN_PASSWORD = process.env.SEED_MERCHANT_ADMIN_PASSWORD || "Merchant@Katabazaar#2026!Local";
const MERCHANT_ADMIN_NAME = process.env.SEED_MERCHANT_ADMIN_NAME || "Katabazaar Merchant Administrator";
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

const log = (message) => process.stdout.write(`[admin-reset] ${message}\n`);

const ensureNotAccidentalProductionReset = () => {
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.RESET_ADMIN_ACCOUNTS_CONFIRM !== "DELETE_ADMINS") {
    throw new Error("Refusing production admin reset without RESET_ADMIN_ACCOUNTS_CONFIRM=DELETE_ADMINS.");
  }
};

const upsertAdminAccount = async ({ email, password, name, role }) => {
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role,
      isActive: true,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    create: {
      email,
      passwordHash,
      name,
      role,
      isActive: true,
    },
  });
};

const deleteOldAdminDependents = async (tx, oldAdminIds) => {
  await tx.refreshToken.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.sessionBinding.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.accessTokenRevocation.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.passwordResetToken.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.authAttemptCounter.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.threatScore.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.cart.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.wishlist.deleteMany({ where: { userId: { in: oldAdminIds } } });
  await tx.offerRedemption.deleteMany({ where: { userId: { in: oldAdminIds } } });
};

const reassignOldAdminReferences = async (tx, { oldAdminIds, platformAdminId, merchantAdminId }) => {
  await tx.product.updateMany({ where: { listerId: { in: oldAdminIds } }, data: { listerId: merchantAdminId } });
  await tx.orderItem.updateMany({ where: { listerId: { in: oldAdminIds } }, data: { listerId: merchantAdminId } });

  await tx.auditLog.updateMany({ where: { actorId: { in: oldAdminIds } }, data: { actorId: platformAdminId } });
  await tx.incident.updateMany({ where: { createdById: { in: oldAdminIds } }, data: { createdById: platformAdminId } });
  await tx.incident.updateMany({ where: { updatedById: { in: oldAdminIds } }, data: { updatedById: platformAdminId } });
  await tx.honeypotTrap.updateMany({ where: { createdById: { in: oldAdminIds } }, data: { createdById: platformAdminId } });
  await tx.emergencyAlert.updateMany({ where: { createdById: { in: oldAdminIds } }, data: { createdById: platformAdminId } });
  await tx.globalPaymentPolicy.updateMany({ where: { updatedById: { in: oldAdminIds } }, data: { updatedById: platformAdminId } });
  await tx.threatRule.updateMany({ where: { updatedById: { in: oldAdminIds } }, data: { updatedById: platformAdminId } });
  await tx.rolePolicy.updateMany({ where: { updatedById: { in: oldAdminIds } }, data: { updatedById: platformAdminId } });
  await tx.emergencyConfig.updateMany({ where: { updatedById: { in: oldAdminIds } }, data: { updatedById: platformAdminId } });
  await tx.compliancePolicy.updateMany({ where: { updatedById: { in: oldAdminIds } }, data: { updatedById: platformAdminId } });
  await tx.notificationEvent.updateMany({ where: { recipientId: { in: oldAdminIds } }, data: { recipientId: platformAdminId } });
  await tx.threatEvent.updateMany({ where: { userId: { in: oldAdminIds } }, data: { userId: platformAdminId } });
};

async function main() {
  ensureNotAccidentalProductionReset();
  log(`Target DB: ${process.env.DATABASE_URL?.replace(/:[^:@]*@/, ":***@") ?? "(unknown)"}`);

  const platformAdmin = await upsertAdminAccount({
    email: PLATFORM_ADMIN_EMAIL,
    password: PLATFORM_ADMIN_PASSWORD,
    name: PLATFORM_ADMIN_NAME,
    role: "SECURITY_ADMIN",
  });
  const merchantAdmin = await upsertAdminAccount({
    email: MERCHANT_ADMIN_EMAIL,
    password: MERCHANT_ADMIN_PASSWORD,
    name: MERCHANT_ADMIN_NAME,
    role: "COMMERCE_ADMIN",
  });

  const oldAdmins = await prisma.user.findMany({
    where: {
      role: { in: ADMIN_SURFACE_ROLES },
      email: { notIn: [PLATFORM_ADMIN_EMAIL, MERCHANT_ADMIN_EMAIL] },
    },
    select: { id: true, email: true, role: true },
  });

  const oldAdminIds = oldAdmins.map((user) => user.id);

  await prisma.$transaction(async (tx) => {
    if (oldAdminIds.length) {
      await reassignOldAdminReferences(tx, {
        oldAdminIds,
        platformAdminId: platformAdmin.id,
        merchantAdminId: merchantAdmin.id,
      });
      await deleteOldAdminDependents(tx, oldAdminIds);
      await tx.user.deleteMany({ where: { id: { in: oldAdminIds } } });
    }
  });

  log(`Removed admin-surface users: ${oldAdmins.length}`);
  for (const user of oldAdmins) {
    log(`  deleted ${user.email} (${user.role})`);
  }
  log(`Platform admin login: ${PLATFORM_ADMIN_EMAIL} / ${PLATFORM_ADMIN_PASSWORD}`);
  log(`Merchant admin login: ${MERCHANT_ADMIN_EMAIL} / ${MERCHANT_ADMIN_PASSWORD}`);
}

main()
  .catch((error) => {
    process.stderr.write(`[admin-reset] FATAL: ${error.message}\n`);
    process.stderr.write(`${error.stack}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
