import { prisma } from "../config/prisma.js";

const DEFAULT_CHANNELS = ["EMAIL", "WHATSAPP"];
const DEFAULT_CATEGORIES = ["ORDER", "OFFER", "ACCOUNT", "MARKETING"];

/**
 * GET /api/v1/notifications/preferences
 * Returns the current user's notification preferences.
 * Creates defaults on first call if none exist.
 */
export const getNotificationPreferences = async (req, res) => {
  const userId = req.user.id;

  let prefs = await prisma.notificationPreference.findMany({ where: { userId } });

  // Upsert defaults for any missing channel+category combinations
  const existing = new Set(prefs.map(p => `${p.channel}|${p.eventCategory}`));
  const toCreate = [];
  for (const channel of DEFAULT_CHANNELS) {
    for (const eventCategory of DEFAULT_CATEGORIES) {
      if (!existing.has(`${channel}|${eventCategory}`)) {
        toCreate.push({ userId, channel, eventCategory, enabled: true });
      }
    }
  }
  if (toCreate.length > 0) {
    await prisma.notificationPreference.createMany({ data: toCreate, skipDuplicates: true });
    prefs = await prisma.notificationPreference.findMany({ where: { userId } });
  }

  // Shape into nested { channel: { category: boolean } } map for frontend
  const map = {};
  for (const p of prefs) {
    if (!map[p.channel]) map[p.channel] = {};
    map[p.channel][p.eventCategory] = p.enabled;
  }

  res.json({ preferences: map, raw: prefs });
};

/**
 * PATCH /api/v1/notifications/preferences
 * Body: { channel, eventCategory, enabled }
 * OR:   { updates: [{ channel, eventCategory, enabled }, ...] }
 */
export const updateNotificationPreferences = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body.updates || [req.body];

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "Provide updates array or single { channel, eventCategory, enabled }." });
  }

  const results = await Promise.all(
    updates.map(({ channel, eventCategory, enabled }) => {
      if (!channel || !eventCategory || typeof enabled !== "boolean") return null;
      return prisma.notificationPreference.upsert({
        where: { userId_channel_eventCategory: { userId, channel, eventCategory } },
        create: { userId, channel, eventCategory, enabled },
        update: { enabled },
      });
    })
  );

  res.json({ updated: results.filter(Boolean).length });
};
