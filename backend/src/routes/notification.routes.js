import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import {
  listNotificationsController,
  markAllNotificationsReadController,
} from "../controllers/notification.controller.js";

const router = Router();

router.use(requireAuthenticatedUserMiddleware);

router.get("/", asyncHandler(listNotificationsController));
router.patch("/read-all", asyncHandler(markAllNotificationsReadController));

import { getNotificationPreferences, updateNotificationPreferences } from "../controllers/notification-preferences.controller.js";
router.get("/preferences", asyncHandler(getNotificationPreferences));
router.patch("/preferences", asyncHandler(updateNotificationPreferences));

router.get("/debug", (req, res) => res.json({ headers: req.headers, cookies: req.cookies }));

export default router;
