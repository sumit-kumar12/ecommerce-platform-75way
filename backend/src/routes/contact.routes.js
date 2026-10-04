import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const router = Router();

const contactSchema = z.object({
  subject: z.string().min(1),
  orderId: z.string().optional(),
  message: z.string().min(1),
});

router.post("/", asyncHandler(async (req, res) => {
  const { subject, orderId, message } = contactSchema.parse(req.body);
  const logFile = path.join(process.cwd(), "contact-messages.log");
  const logEntry = `[${new Date().toISOString()}] User: ${req.user?.email || "Guest"} | Subject: ${subject} | Order: ${orderId || "N/A"} | Message: ${message}\n`;
  await fs.appendFile(logFile, logEntry);
  res.status(200).json({ success: true, message: "Message received" });
}));

export default router;
