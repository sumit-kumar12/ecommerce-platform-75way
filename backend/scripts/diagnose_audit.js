import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("--- DATABASE DIAGNOSE ---");
  try {
    const userCount = await prisma.user.count();
    const auditCount = await prisma.auditLog.count();
    const latestLogs = await prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { email: true } } }
    });

    console.log("Total Users:", userCount);
    console.log("Total Audit Logs:", auditCount);
    console.log("Latest Logs Sample:", JSON.stringify(latestLogs, null, 2));
    
    if (auditCount === 0) {
      console.log("⚠️ WARNING: No audit logs found in the database.");
    }
  } catch (err) {
    console.error("❌ ERROR during diagnosis:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
