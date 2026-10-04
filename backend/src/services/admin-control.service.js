import { env } from "../config/env.js";
import { prisma } from "../config/prisma.js";
import { redis } from "../config/redis.js";
import { ROLES } from "../config/constants.js";
import { AppError } from "../errors/app-error.js";

const GLOBAL_LOCKOUT_KEY = `${env.REDIS_KEY_PREFIX}:security:global_lockout`;
const TRAP_CACHE_TTL_MS = 30_000;
const ROLE_POLICY_CACHE_TTL_MS = 30_000;

const SECURITY_READ_PERMISSIONS = [
  "security:read",
  "monitoring:read",
  "threats:read",
  "audit:read",
  "users:read",
  "sessions:read",
  "lockout:read",
  "incidents:read",
  "honeypot:read",
  "rbac:read",
  "payment_gateway:read",
  "payment_rules:read",
  "search:read",
];

const SECURITY_WRITE_PERMISSIONS = [
  "security:write",
  "threats:write",
  "users:write",
  "sessions:write",
  "lockout:write",
  "incidents:write",
  "honeypot:write",
  "rbac:write",
  "payment_gateway:write",
  "payment_rules:write",
  "emergency:broadcast",
];

const COMMERCE_READ_PERMISSIONS = [
  "commerce:read",
  "orders:read",
  "products:read",
  "categories:read",
  "offers:read",
  "discounts:read",
  "media:read",
  "search:read",
];

const COMMERCE_WRITE_PERMISSIONS = [
  "orders:write",
  "products:write",
  "categories:write",
  "offers:write",
  "discounts:write",
  "media:write",
];

const SUPPORT_PERMISSIONS = [
  "commerce:read",
  "orders:read",
  "products:read",
  "categories:read",
  "offers:read",
  "users:read",
  "search:read",
];

const VIEWER_PERMISSIONS = [
  "commerce:read",
  "orders:read",
  "products:read",
  "categories:read",
  "offers:read",
  "monitoring:read",
  "audit:read",
  "search:read",
];

const ALL_ADMIN_PERMISSIONS = Array.from(
  new Set([
    ...SECURITY_READ_PERMISSIONS,
    ...SECURITY_WRITE_PERMISSIONS,
    ...COMMERCE_READ_PERMISSIONS,
    ...COMMERCE_WRITE_PERMISSIONS,
    "compliance:read",
  ]),
).sort((left, right) => left.localeCompare(right));

const defaultRolePolicies = [
  {
    role: ROLES.ADMIN,
    color: "#f87171",
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    role: ROLES.SUPER_ADMIN,
    color: "#fb7185",
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    role: ROLES.SECURITY_ADMIN,
    color: "#38bdf8",
    permissions: ALL_ADMIN_PERMISSIONS,
  },
  {
    role: ROLES.COMMERCE_ADMIN,
    color: "#34d399",
    permissions: [...COMMERCE_READ_PERMISSIONS, ...COMMERCE_WRITE_PERMISSIONS],
  },
  {
    role: ROLES.PRODUCT_LISTER,
    color: "#60a5fa",
    permissions: [
      "commerce:read",
      "orders:read",
      "products:read",
      "products:write",
      "categories:read",
      "media:read",
      "media:write",
    ],
  },
  {
    role: ROLES.SUPPORT_AGENT,
    color: "#fbbf24",
    permissions: SUPPORT_PERMISSIONS,
  },
  {
    role: ROLES.VIEWER,
    color: "#a78bfa",
    permissions: VIEWER_PERMISSIONS,
  },
  {
    role: ROLES.CUSTOMER,
    color: "#94a3b8",
    permissions: ["orders:read", "products:read"],
  },
];

export const supportedRolePermissions = Array.from(
  new Set(defaultRolePolicies.flatMap((policy) => policy.permissions)),
).sort((left, right) => left.localeCompare(right));

const defaultCompliancePolicies = [
  { name: "Password Policy", category: "Auth", status: "ACTIVE" },
  { name: "Data Retention Policy", category: "Data", status: "ACTIVE" },
  { name: "Incident Response Plan", category: "Security", status: "ACTIVE" },
  { name: "Third-Party Vendor Review", category: "Vendor", status: "REVIEW" },
  { name: "Penetration Testing", category: "Testing", status: "SCHEDULED" },
];

let trapCache = {
  expiresAt: 0,
  paths: new Set(),
};

let rolePolicyCache = {
  expiresAt: 0,
  policies: new Map(),
};

const getDefaultRolePolicy = (role) => defaultRolePolicies.find((policy) => policy.role === role) ?? null;

const refreshRolePolicyCache = async (force = false) => {
  if (!force && Date.now() < rolePolicyCache.expiresAt) return rolePolicyCache.policies;
  const rows = await prisma.rolePolicy.findMany();
  const policies = new Map();

  for (const policy of defaultRolePolicies) {
    policies.set(policy.role, {
      ...policy,
      permissions: Array.isArray(policy.permissions) ? policy.permissions : [],
    });
  }

  for (const row of rows) {
    const fallback = getDefaultRolePolicy(row.role);
    policies.set(row.role, {
      role: row.role,
      color: row.color ?? fallback?.color ?? "#94a3b8",
      permissions: Array.isArray(row.permissions) ? row.permissions : fallback?.permissions ?? [],
    });
  }

  rolePolicyCache = {
    expiresAt: Date.now() + ROLE_POLICY_CACHE_TTL_MS,
    policies,
  };
  return policies;
};

export const invalidateRolePolicyCache = () => {
  rolePolicyCache = { expiresAt: 0, policies: new Map() };
};

export const getRolePermissions = async (role) => {
  const policies = await refreshRolePolicyCache();
  return policies.get(role)?.permissions ?? [];
};

export const roleHasPermission = async (role, permission) => {
  const permissions = await getRolePermissions(role);
  return permissions.includes(permission);
};

const normalizeTrapPath = (value) => {
  const source = String(value ?? "").trim();
  if (!source) throw new AppError("Trap path is required.", 400, "INVALID_TRAP_PATH");
  if (!source.startsWith("/")) throw new AppError("Trap path must start with '/'.", 400, "INVALID_TRAP_PATH");
  if (source.length > 200) throw new AppError("Trap path is too long.", 400, "INVALID_TRAP_PATH");
  if (!/^\/[a-zA-Z0-9/_-]*$/.test(source)) {
    throw new AppError("Trap path contains invalid characters.", 400, "INVALID_TRAP_PATH");
  }
  return source;
};

export const ensureAdminControlDefaults = async () => {
  for (const policy of defaultRolePolicies) {
    const existing = await prisma.rolePolicy.findUnique({ where: { role: policy.role } });
    if (!existing) {
      await prisma.rolePolicy.create({
        data: {
          role: policy.role,
          color: policy.color,
          permissions: policy.permissions,
        },
      });
      continue;
    }

    const existingPermissions = Array.isArray(existing.permissions) ? existing.permissions : [];
    const mergedPermissions = Array.from(new Set([...existingPermissions, ...policy.permissions])).sort((left, right) =>
      left.localeCompare(right),
    );

    await prisma.rolePolicy.update({
      where: { role: policy.role },
      data: {
        role: policy.role,
        color: existing.color ?? policy.color,
        permissions: mergedPermissions,
      },
    });
  }
  invalidateRolePolicyCache();

  await prisma.emergencyConfig.upsert({
    where: { singletonKey: "GLOBAL" },
    create: {
      singletonKey: "GLOBAL",
      enabled: false,
      channels: ["email"],
      defaultSeverity: "HIGH",
      recipients: [],
    },
    update: {},
  });

  for (const policy of defaultCompliancePolicies) {
    await prisma.compliancePolicy.upsert({
      where: { name: policy.name },
      create: {
        name: policy.name,
        category: policy.category,
        status: policy.status,
      },
      update: {},
    });
  }

  const trapOwner =
    (await prisma.user.findFirst({ where: { role: { in: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.SECURITY_ADMIN] } }, select: { id: true } })) ??
    (await prisma.user.findFirst({ select: { id: true } }));
  if (trapOwner?.id) {
    await prisma.honeypotTrap.upsert({
      where: { path: env.HONEYPOT_PATH },
      create: {
        path: env.HONEYPOT_PATH,
        type: "ENDPOINT",
        active: true,
        createdById: trapOwner.id,
      },
      update: { active: true },
    });
  }

  await refreshTrapPathCache(true);
};

const refreshTrapPathCache = async (force = false) => {
  if (!force && Date.now() < trapCache.expiresAt) return;
  const rows = await prisma.honeypotTrap.findMany({
    where: { active: true },
    select: { path: true },
  });
  trapCache = {
    expiresAt: Date.now() + TRAP_CACHE_TTL_MS,
    paths: new Set(rows.map((row) => row.path)),
  };
};

export const isConfiguredHoneypotPath = async (path) => {
  if (env.NODE_ENV === "test") return false;
  const normalized = normalizeTrapPath(path);
  await refreshTrapPathCache();
  return trapCache.paths.has(normalized);
};

export const listHoneypotTraps = async () =>
  prisma.honeypotTrap.findMany({
    orderBy: [{ active: "desc" }, { updatedAt: "desc" }],
  });

export const createHoneypotTrap = async ({ path, type, actorId }) => {
  const normalizedPath = normalizeTrapPath(path);
  const trap = await prisma.honeypotTrap.upsert({
    where: { path: normalizedPath },
    create: {
      path: normalizedPath,
      type: String(type ?? "ENDPOINT").slice(0, 40),
      active: true,
      createdById: actorId,
    },
    update: {
      type: String(type ?? "ENDPOINT").slice(0, 40),
      active: true,
    },
  });
  await refreshTrapPathCache(true);
  return trap;
};

export const deactivateHoneypotTrap = async ({ trapId }) => {
  const existing = await prisma.honeypotTrap.findUnique({ where: { id: trapId } });
  if (!existing) throw new AppError("Honeypot trap not found.", 404, "HONEYPOT_TRAP_NOT_FOUND");
  await prisma.honeypotTrap.update({
    where: { id: trapId },
    data: { active: false },
  });
  await refreshTrapPathCache(true);
};

export const recordHoneypotTrigger = async (path) => {
  if (env.NODE_ENV === "test") return;
  const normalizedPath = normalizeTrapPath(path);
  await prisma.honeypotTrap.updateMany({
    where: { path: normalizedPath, active: true },
    data: {
      triggerCount: { increment: 1 },
      lastTriggeredAt: new Date(),
    },
  });
};

export const getGlobalLockoutState = async () => {
  const payload = await redis.get(GLOBAL_LOCKOUT_KEY);
  if (!payload) return { locked: false, lockedAt: null, reason: null, lockedById: null };
  try {
    const parsed = JSON.parse(payload);
    return {
      locked: true,
      lockedAt: parsed.lockedAt ?? null,
      reason: parsed.reason ?? null,
      lockedById: parsed.lockedById ?? null,
    };
  } catch {
    return { locked: true, lockedAt: null, reason: null, lockedById: null };
  }
};

export const setGlobalLockoutState = async ({ locked, reason, actorId }) => {
  if (locked) {
    await redis.set(
      GLOBAL_LOCKOUT_KEY,
      JSON.stringify({
        lockedAt: new Date().toISOString(),
        reason: String(reason ?? "Emergency lockout"),
        lockedById: actorId,
      }),
    );
    return;
  }
  await redis.del(GLOBAL_LOCKOUT_KEY);
};

export const assertNotGloballyLocked = async () => {
  const state = await getGlobalLockoutState();
  if (state.locked) throw new AppError("Platform is in emergency lockout mode.", 423, "GLOBAL_LOCKOUT_ACTIVE");
};

const minutesBetween = (start, end = new Date()) => {
  if (!start) return null;
  const value = Math.floor((end.getTime() - new Date(start).getTime()) / 60000);
  return Number.isFinite(value) ? Math.max(value, 0) : null;
};

const buildSessionRiskFlags = ({ session, refreshToken }) => {
  const flags = [];
  const idleMinutes = minutesBetween(session.lastSeenAt);
  const ageMinutes = minutesBetween(session.createdAt);

  if (session.lastSeenIp && session.initialIp && session.lastSeenIp !== session.initialIp) flags.push("IP_CHANGED");
  if (
    session.lastSeenUserAgentHash &&
    session.initialUserAgentHash &&
    session.lastSeenUserAgentHash !== session.initialUserAgentHash
  ) {
    flags.push("USER_AGENT_CHANGED");
  }
  if (idleMinutes !== null && idleMinutes > 24 * 60) flags.push("STALE_SESSION");
  if (ageMinutes !== null && ageMinutes > 7 * 24 * 60) flags.push("LONG_LIVED_SESSION");
  if (!refreshToken) flags.push("NO_ACTIVE_REFRESH_TOKEN");

  return flags;
};

export const countActiveSessions = async () => prisma.sessionBinding.count({ where: { revokedAt: null } });

export const listActiveSessions = async ({ limit = 50 }) => {
  const sessions = await prisma.sessionBinding.findMany({
    where: { revokedAt: null },
    orderBy: { lastSeenAt: "desc" },
    take: Math.min(Math.max(limit, 1), 200),
    include: {
      user: {
        select: { id: true, email: true, name: true, role: true },
      },
    },
  });

  const refreshTokens = await Promise.all(
    sessions.map((session) =>
      prisma.refreshToken.findFirst({
        where: {
          userId: session.userId,
          familyId: session.familyId,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { issuedAt: "desc" },
        select: {
          id: true,
          issuedAt: true,
          expiresAt: true,
          createdByIp: true,
        },
      }),
    ),
  );

  return sessions.map((session, index) => {
    const refreshToken = refreshTokens[index];
    const idleMinutes = minutesBetween(session.lastSeenAt);
    const ageMinutes = minutesBetween(session.createdAt);
    return {
      ...session,
      review: {
        initialIp: session.initialIp,
        lastSeenIp: session.lastSeenIp,
        ipChanged: Boolean(session.lastSeenIp && session.initialIp && session.lastSeenIp !== session.initialIp),
        deviceIdHash: session.deviceIdHash,
        initialUserAgentHash: session.initialUserAgentHash,
        lastSeenUserAgentHash: session.lastSeenUserAgentHash,
        userAgentChanged: Boolean(
          session.lastSeenUserAgentHash &&
            session.initialUserAgentHash &&
            session.lastSeenUserAgentHash !== session.initialUserAgentHash,
        ),
        ageMinutes,
        idleMinutes,
        refreshTokenIssuedAt: refreshToken?.issuedAt ?? null,
        refreshTokenExpiresAt: refreshToken?.expiresAt ?? null,
        refreshTokenCreatedByIp: refreshToken?.createdByIp ?? null,
        riskFlags: buildSessionRiskFlags({ session, refreshToken }),
      },
    };
  });
};

export const revokeSessionById = async ({ sessionId, reason }) => {
  const session = await prisma.sessionBinding.findUnique({ where: { id: sessionId } });
  if (!session) throw new AppError("Session not found.", 404, "SESSION_NOT_FOUND");

  await prisma.sessionBinding.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });
  await prisma.refreshToken.updateMany({
    where: { userId: session.userId, familyId: session.familyId, revokedAt: null },
    data: {
      revokedAt: new Date(),
      revocationReason: reason,
    },
  });
};

export const revokeAllSessions = async ({ reason, exceptUserId = null }) => {
  const scope = exceptUserId ? { userId: { not: exceptUserId } } : {};
  await prisma.sessionBinding.updateMany({
    where: { revokedAt: null, ...scope },
    data: { revokedAt: new Date() },
  });
  await prisma.refreshToken.updateMany({
    where: { revokedAt: null, ...scope },
    data: {
      revokedAt: new Date(),
      revocationReason: reason,
    },
  });
};

export const listRolePolicies = async () => {
  const [rows, usageRows] = await Promise.all([
    prisma.rolePolicy.findMany(),
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
  ]);

  const rolePolicyByRole = new Map(rows.map((row) => [row.role, row]));
  const assignedUserCountByRole = new Map(usageRows.map((row) => [row.role, row._count._all]));

  return defaultRolePolicies.map((policy) => {
    const persisted = rolePolicyByRole.get(policy.role);
    const permissions = Array.isArray(persisted?.permissions) ? persisted.permissions : policy.permissions;

    return {
      id: policy.role.toLowerCase(),
      role: policy.role,
      name: policy.role
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      color: persisted?.color ?? policy.color,
      permissions,
      assignedUserCount: assignedUserCountByRole.get(policy.role) ?? 0,
      isSystemRole: true,
    };
  });
};

export const updateRolePolicy = async ({ role, permissions, updatedById }) => {
  const updated = await prisma.rolePolicy.update({
    where: { role },
    data: {
      permissions,
      updatedById,
    },
  });
  invalidateRolePolicyCache();
  return updated;
};

export const getEmergencyConfig = async () =>
  prisma.emergencyConfig.findUnique({
    where: { singletonKey: "GLOBAL" },
  });

export const updateEmergencyConfig = async ({ config, actorId }) =>
  prisma.emergencyConfig.update({
    where: { singletonKey: "GLOBAL" },
    data: {
      enabled: Boolean(config.enabled),
      channels: config.channels,
      defaultSeverity: String(config.defaultSeverity),
      recipients: config.recipients,
      updatedById: actorId,
    },
  });
