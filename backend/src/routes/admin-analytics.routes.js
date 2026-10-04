import { Router } from "express";
import { getTrafficAnalyticsController, getFunnelAnalyticsController } from "../controllers/admin-analytics.controller.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const adminAnalyticsRoutes = Router();

adminAnalyticsRoutes.get(
  "/traffic",
  requireRoles(["SUPER_ADMIN", "ADMIN", "COMMERCE_ADMIN"]),
  getTrafficAnalyticsController
);

adminAnalyticsRoutes.get(
  "/funnel",
  requireRoles(["SUPER_ADMIN", "ADMIN", "COMMERCE_ADMIN"]),
  getFunnelAnalyticsController
);

export default adminAnalyticsRoutes;
