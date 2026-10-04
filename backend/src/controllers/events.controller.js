import { PrismaClient } from "@prisma/client";
import { loggers } from "../config/logger.js";

const prisma = new PrismaClient();

export const pageViewEventController = async (req, res) => {
  try {
    const { path, referrer, sessionId } = req.body;
    if (!path) {
      return res.status(400).json({ error: "Path is required" });
    }

    const ip = req.ip || req.connection?.remoteAddress || null;
    const userAgent = req.get("user-agent") || null;
    const userId = req.user?.id || null;

    await prisma.pageView.create({
      data: {
        path,
        referrer: referrer || null,
        userAgent,
        ip,
        userId,
        sessionId: sessionId || null,
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    loggers.app.error("Failed to record page view event", err);
    // Don't fail the request if analytics ingestion fails
    return res.status(200).json({ success: false, error: "Ingestion failed" });
  }
};
