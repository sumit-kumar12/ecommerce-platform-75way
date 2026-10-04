import { z } from "zod";
import { loggers } from "../config/logger.js";
import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { FULL_ADMIN_ROLES, ROLES } from "../config/constants.js";
import { AppError } from "../errors/app-error.js";
import { writeAuditLog } from "../services/audit.service.js";
import { addThreatEvent } from "../services/threat.service.js";

const ROLE_VALUES = Object.values(ROLES);

const changeRoleSchema = z.object({
  role: z.enum(ROLE_VALUES),
});

const lockSchema = z.object({
  isActive: z.boolean(),
});
const userParamSchema = z.object({
  userId: z.string().uuid(),
});

export const listUsersController = async (req, res) => {
  const query = z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(25),
      status: z.enum(["ACTIVE", "BANNED", "ADMIN"]).optional(),
      role: z.enum(ROLE_VALUES).optional(),
      search: z.string().max(120).optional(),
    })
    .parse(req.query);

  const where = {
    ...(query.status === "ACTIVE" ? { isActive: true } : {}),
    ...(query.status === "BANNED" ? { isActive: false } : {}),
    ...(query.status === "ADMIN" ? { role: { in: FULL_ADMIN_ROLES } } : {}),
    ...(query.role ? { role: query.role } : {}),
    ...(query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: "insensitive" } },
            { name: { contains: query.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
        orders: {
          where: { status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
          select: { totalAmount: true }
        }
      },
    }),
  ]);

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "LIST_USERS",
    targetType: "USER",
    targetId: "*",
    details: { returnedCount: users.length, total },
  });
  res.status(200).json({
    users: users.map((user) => {
      const totalSpent = user.orders ? user.orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0) : 0;
      // Remove orders array from payload to keep it light
      const { orders, ...userWithoutOrders } = user;
      
      return {
        ...userWithoutOrders,
        banned: !user.isActive,
        totalOrders: user._count.orders,
        totalSpent: totalSpent
      };
    }),
    total,
  });
};

export const changeUserRoleController = async (req, res) => {
  const input = changeRoleSchema.parse(req.body);
  const { userId } = userParamSchema.parse(req.params);

  if (userId === req.user.id) {
    throw new AppError("You cannot change your own role.", 400, "SELF_ROLE_CHANGE_FORBIDDEN");
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new AppError("User not found.", 404, "USER_NOT_FOUND");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: input.role },
  });
  await redis.del(`user-cache:${userId}`);

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "ROLE_CHANGE",
    targetType: "USER",
    targetId: userId,
    details: {
      previousRole: target.role,
      newRole: input.role,
    },
  });

  loggers.security.warn({
    eventType: "role_changed",
    userId: req.user.id,
    details: {
      targetUserId: userId,
      previousRole: target.role,
      newRole: input.role,
    },
  });

  res.status(200).json({ user: updated });
};

export const setUserActiveController = async (req, res) => {
  const input = lockSchema.parse(req.body);
  const { userId } = userParamSchema.parse(req.params);

  if (userId === req.user.id) {
    throw new AppError("You cannot deactivate your own account.", 400, "SELF_DEACTIVATION_FORBIDDEN");
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw new AppError("User not found.", 404, "USER_NOT_FOUND");

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      isActive: input.isActive,
      lockedUntil: input.isActive ? null : target.lockedUntil ?? new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  await redis.del(`user-cache:${userId}`);

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: input.isActive ? "ACCOUNT_REACTIVATE" : "ACCOUNT_DEACTIVATE",
    targetType: "USER",
    targetId: userId,
    details: {},
  });

  res.status(200).json({ user: updated });
};

export const listAuditLogsController = async (req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "LIST_AUDIT_LOGS",
    targetType: "AUDIT_LOG",
    targetId: "*",
    details: { returnedCount: logs.length },
  });
  res.status(200).json({ logs });
};

export const listThreatEventsController = async (req, res) => {
  const events = await prisma.threatEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "LIST_THREAT_EVENTS",
    targetType: "THREAT_EVENT",
    targetId: "*",
    details: { returnedCount: events.length },
  });
  res.status(200).json({ events });
};

const userIdsSchema = z.object({
  userIds: z.array(z.string().uuid()).min(1).max(50),
});

export const getUserDetailController = async (req, res) => {
  const { userId } = z.object({ userId: z.string().uuid() }).parse(req.params);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isActive: true,
      failedLoginAttempts: true,
      lockedUntil: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { orders: true, auditLogs: true, threatEvents: true },
      },
    },
  });
  if (!user) throw new AppError("User not found.", 404, "USER_NOT_FOUND");

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "VIEW_USER_DETAIL",
    targetType: "USER",
    targetId: userId,
    details: {},
  });

  return res.status(200).json({ user });
};

export const bulkDeactivateUsersController = async (req, res) => {
  const input = userIdsSchema.parse(req.body);

  // Prevent self-deactivation
  if (input.userIds.includes(req.user.id)) {
    throw new AppError("Admin cannot deactivate their own account.", 400, "SELF_DEACTIVATION_FORBIDDEN");
  }

  // Prevent deactivating other ADMINs unless superadmin
  const targetAdmins = await prisma.user.findMany({
    where: { id: { in: input.userIds }, role: { in: FULL_ADMIN_ROLES } },
    select: { id: true, email: true },
  });
  if (targetAdmins.length > 0) {
    throw new AppError(
      `Cannot bulk-deactivate admin accounts: ${targetAdmins.map((u) => u.email).join(", ")}.`,
      403,
      "CANNOT_DEACTIVATE_ADMIN",
    );
  }

  const lockUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
  await prisma.user.updateMany({
    where: { id: { in: input.userIds }, role: { notIn: FULL_ADMIN_ROLES } },
    data: { isActive: false, lockedUntil: lockUntil },
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "BULK_DEACTIVATE_USERS",
    targetType: "USER",
    targetId: "*",
    details: { userIds: input.userIds, count: input.userIds.length },
  });

  loggers.security.warn({
    eventType: "admin_bulk_deactivate",
    userId: req.user.id,
    details: { targetUserIds: input.userIds, count: input.userIds.length },
  });

  return res.status(200).json({ deactivated: input.userIds.length });
};

export const bulkIpBlockUsersController = async (req, res) => {
  const ipBlockSchema = z.object({
    userIds: z.array(z.string().uuid()).min(1).max(50),
    minutes: z.number().int().min(1).max(10080).default(1440),
    reason: z.string().min(5).max(200),
  });
  const input = ipBlockSchema.parse(req.body);

  if (input.userIds.includes(req.user.id)) {
    throw new AppError("Admin cannot IP-block themselves.", 400, "SELF_IP_BLOCK_FORBIDDEN");
  }

  const users = await prisma.user.findMany({
    where: { id: { in: input.userIds } },
    select: { id: true, email: true, role: true },
  });

  const adminTargets = users.filter((u) => FULL_ADMIN_ROLES.includes(u.role));
  if (adminTargets.length > 0) {
    throw new AppError(
      `Cannot IP-block admin accounts: ${adminTargets.map((u) => u.email).join(", ")}.`,
      403,
      "CANNOT_IP_BLOCK_ADMIN",
    );
  }

  const blockedUntil = new Date(Date.now() + input.minutes * 60 * 1000);

  // Find recent IPs from threat events for these users
  const recentIpEvents = await prisma.threatEvent.findMany({
    where: {
      userId: { in: input.userIds },
      createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    select: { ip: true, userId: true },
    distinct: ["ip", "userId"],
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const uniqueIps = [...new Set(recentIpEvents.map((e) => e.ip))].filter(
    (ip) => ip && ip !== "0.0.0.0",
  );

  let blockedCount = 0;
  for (const ip of uniqueIps) {
    await prisma.iPBlock.upsert({
      where: { ip },
      create: { ip, blockedUntil, reason: input.reason },
      update: { blockedUntil, reason: input.reason },
    });
    blockedCount++;
  }

  // Add threat events for each user
  for (const userId of input.userIds) {
    await addThreatEvent({
      req,
      userId,
      eventType: "admin_bulk_ip_block",
      details: { adminId: req.user.id, reason: input.reason, blockedUntil },
    });
  }

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "BULK_IP_BLOCK_USERS",
    targetType: "USER",
    targetId: "*",
    details: {
      userIds: input.userIds,
      ipsBlocked: uniqueIps,
      blockedIpCount: blockedCount,
      minutes: input.minutes,
      reason: input.reason,
    },
  });

  loggers.security.warn({
    eventType: "admin_bulk_ip_block",
    userId: req.user.id,
    details: { targetUserCount: input.userIds.length, ipsBlocked: uniqueIps, reason: input.reason },
  });

  return res.status(200).json({
    targetUsers: input.userIds.length,
    ipsBlocked: uniqueIps,
    blockedUntil,
  });
};
