import { prisma } from "../config/prisma.js";

/**
 * GET /api/v1/users/me/sessions
 * Returns all active SessionBindings for the current user.
 */
export const getUserSessions = async (req, res) => {
  const userId = req.user.id;

  const sessions = await prisma.sessionBinding.findMany({
    where: { userId, revokedAt: null },
    orderBy: { lastSeenAt: "desc" },
    select: {
      id: true,
      familyId: true,
      initialIp: true,
      lastSeenIp: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });

  res.json({ sessions });
};

/**
 * DELETE /api/v1/users/me/sessions/:sessionId
 * Revokes a specific session binding for the current user.
 */
export const revokeUserSession = async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;

  const session = await prisma.sessionBinding.findFirst({
    where: { id: sessionId, userId, revokedAt: null },
  });

  if (!session) {
    return res.status(404).json({ error: "Session not found or already revoked." });
  }

  // Revoke the SessionBinding
  await prisma.sessionBinding.update({
    where: { id: sessionId },
    data: { revokedAt: new Date() },
  });

  // Also revoke all refresh tokens in the same family
  await prisma.refreshToken.updateMany({
    where: { userId, familyId: session.familyId, revokedAt: null },
    data: { revokedAt: new Date(), revocationReason: "user_revoked_session" },
  });

  res.json({ message: "Session revoked." });
};
