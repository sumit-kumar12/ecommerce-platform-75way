import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

export const listNotificationsController = async (req, res) => {
  let notifications = [];
  try {
    if (prisma.userNotification) {
      notifications = await prisma.userNotification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Fallback if prisma client wasn't regenerated successfully on Windows
      notifications = await prisma.$queryRaw`SELECT * FROM "UserNotification" WHERE "userId" = ${req.user.id} ORDER BY "createdAt" DESC`;
    }
  } catch (e) {
    console.error("Error fetching notifications:", e);
  }
  res.status(200).json({ notifications });
};

export const markAllNotificationsReadController = async (req, res) => {
  try {
    if (prisma.userNotification) {
      await prisma.userNotification.updateMany({
        where: { userId: req.user.id, isRead: false },
        data: { isRead: true },
      });
    } else {
      await prisma.$executeRaw`UPDATE "UserNotification" SET "isRead" = true WHERE "userId" = ${req.user.id} AND "isRead" = false`;
    }
  } catch (e) {
    console.error("Error updating notifications:", e);
  }
  res.status(200).json({ success: true });
};
