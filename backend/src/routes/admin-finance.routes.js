import { Router } from "express";
import { getFinanceSummaryController, getPayoutsController, getTransactionsController } from "../controllers/admin-finance.controller.js";
import { requireRoles } from "../middlewares/role.middleware.js";

const adminFinanceRoutes = Router();

adminFinanceRoutes.get(
  "/summary",
  requireRoles(["SUPER_ADMIN", "ADMIN"]),
  getFinanceSummaryController
);

adminFinanceRoutes.get(
  "/transactions",
  requireRoles(["SUPER_ADMIN", "ADMIN"]),
  getTransactionsController
);

adminFinanceRoutes.get(
  "/payouts",
  requireRoles(["SUPER_ADMIN", "ADMIN"]),
  getPayoutsController
);
export default adminFinanceRoutes;
