import { Router } from "express";
import { z } from "zod";
import { loggers } from "../config/logger.js";

const router = Router();
const logger = loggers.error;

const clientErrorSchema = z.object({
  message: z.string(),
  stack: z.string().optional(),
  path: z.string().optional(),
  userAgent: z.string().optional(),
  source: z.string().optional(),
});

router.post("/", (req, res) => {
  try {
    const errorData = clientErrorSchema.parse(req.body);
    logger.error("Frontend Error", errorData);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Invalid payload" });
  }
});

export default router;
