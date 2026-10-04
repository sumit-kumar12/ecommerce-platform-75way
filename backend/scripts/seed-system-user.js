// ─── Seed: System User ────────────────────────────────────────────────────────
// Creates the SYSTEM user used by the SIEM engine for auto-created cases.
// This user has isActive=false so it CANNOT log in.
// Its role is VIEWER with no permissions — cannot perform any admin action.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const SYSTEM_EMAIL = "system@katabazaar.internal";

  const existing = await prisma.user.findUnique({ where: { email: SYSTEM_EMAIL } });
  if (existing) {
    console.log(`✅ SYSTEM user already exists: ${existing.id}`);
    return existing;
  }

  const user = await prisma.user.create({
    data: {
      email: SYSTEM_EMAIL,
      name: "SYSTEM",
      role: "VIEWER",       // Lowest privilege role
      isActive: false,      // Cannot log in
      passwordHash: null,   // No password — login impossible
    },
  });

  console.log(`✅ SYSTEM user created: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   isActive: ${user.isActive} (cannot log in)`);
  return user;
}

main()
  .catch((err) => {
    console.error("❌ Failed to seed system user:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
