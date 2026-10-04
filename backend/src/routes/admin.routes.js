import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware, resolveSseTokenMiddleware } from "../middlewares/jwt.middleware.js";
import { requireRoles } from "../middlewares/role.middleware.js";
import { requirePermissions } from "../middlewares/permission.middleware.js";
import { ADMIN_SURFACE_ROLES, SECURITY_ADMIN_ROLES } from "../config/constants.js";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import {
  changeUserRoleController,
  listAuditLogsController,
  listThreatEventsController,
  listUsersController,
  setUserActiveController,
  getUserDetailController,
  bulkDeactivateUsersController,
  bulkIpBlockUsersController,
} from "../controllers/admin.controller.js";
import { getPaymentPolicyController, updatePaymentPolicyController } from "../controllers/payment-policy.controller.js";
import { getPaymentGatewayController, updatePaymentGatewayController } from "../controllers/payment-gateway.controller.js";
import {
  createIpBlockController,
  deleteIpBlockController,
  securityOverviewController,
  suspiciousIpsController,
  threatStreamController,
} from "../controllers/security.controller.js";
import {
  monitoringHealthController,
  monitoringMetricsSummaryController,
  monitoringFailedLoginsController,
  monitoringThreatSpikesController,
  monitoringPaymentMismatchesController,
  monitoringThreatActivityController,
  monitoringResourceMatrixController,
  monitoringRadarTopologyController,
  monitoringActivityStreamController,
  monitoringRescanController,
  monitoringUserEngagementController,
  monitoringHistoricalAnalyticsController,
  monitoringLogStreamController,
  monitoringTrafficPulseController,
  monitoringDiskStatusController,
  monitoringSystemManifestController,
  monitoringAuditStatsController,
  monitoringAuditStreamController,
} from "../controllers/admin-monitoring.controller.js";
import { listThreatRulesController, updateThreatRulesController } from "../controllers/threat-policy.controller.js";
import {
  adminAuditListController,
  adminOrderGetController,
  adminOrderPatchController,
  adminOrdersListController,
  adminOrdersExportController,
  adminOrderFulfillController,
  adminOrderRefundController,
  adminProductsCreateController,
  adminProductsDeleteController,
  adminProductImageCreateController,
  adminProductImageDeleteController,
  adminProductImagePrimaryController,
  adminProductGetController,
  adminProductVariantsController,
  adminProductsListController,
  adminProductsExportController,
  adminProductsPatchController,
  adminStatsController,
  adminThreatEventsAliasController,
  adminThreatStatsAliasController,
  adminSingleProductAnalyticsController,
  adminUsersPatchController,
  compliancePoliciesController,
  complianceReportController,
  emergencyBroadcastController,
  emergencyConfigController,
  emergencyHistoryController,
  globalSearchController,
  honeypotEventsListController,
  honeypotTrapsCreateController,
  honeypotTrapsDeleteController,
  honeypotTrapsListController,
  incidentsCreateController,
  incidentsListController,
  incidentsUpdateController,
  lockoutActionController,
  lockoutStatusController,
  paymentRulesHistoryController,
  rolePolicyListController,
  rolePolicyUpdateController,
  sessionsListController,
  sessionsRevokeAllController,
  sessionsRevokeOneController,
} from "../controllers/admin-advanced.controller.js";
import {
  adminCategoriesCreateController,
  adminCategoriesDeleteController,
  adminCategoriesListController,
  adminCategoriesPatchController,
  adminCategoriesReorderController,
  adminCategoriesTreeController,
  adminCategoriesAnalyticsController,
  adminCategoryGetController
} from "../controllers/admin-category.controller.js";
import {
  adminInventoryListController,
  adminInventoryStatsController,
  adminInventoryUpdateController
} from "../controllers/admin-inventory.controller.js";
import {
  adminOffersCreateController,
  adminOffersDeleteController,
  adminOffersListController,
  adminOffersPatchController,
  adminCouponsListController,
} from "../controllers/admin-offer.controller.js";
import {
  createCampaignController,
  deleteCampaignController,
  listAdminCampaignsController,
  editCampaignController,
} from "../controllers/campaign.controller.js";
import {
  createFlashDealController,
  deleteFlashDealController,
  listAdminFlashDealsController,
  editFlashDealController,
  getFlashDealAnalyticsController
} from "../controllers/flash-deal.controller.js";
import {
  createSponsoredAdController,
  listAdminSponsoredAdsController,
  editSponsoredAdController,
  deleteSponsoredAdController,
} from "../controllers/sponsored-ad.controller.js";
import {
  getMerchantBusinessAnalytics,
  getMerchantProductAnalytics
} from "../controllers/merchant-analytics.controller.js";
import adminFinanceRoutes from "./admin-finance.routes.js";
import adminAnalyticsRoutes from "./admin-analytics.routes.js";
import socCasesRoutes from "./soc-cases.routes.js";

const router = Router();

const can = (permissions, options) => requirePermissions(permissions, { hideUnauthorized: true, ...options });

// SSE routes bypass the global Bearer auth but use one-time sseToken
router.get("/monitoring/activity-stream", resolveSseTokenMiddleware, requireRoles(ADMIN_SURFACE_ROLES, { hideUnauthorized: true }), can("monitoring:read"), asyncHandler(monitoringActivityStreamController));
router.get("/monitoring/audit/stream", resolveSseTokenMiddleware, requireRoles(ADMIN_SURFACE_ROLES, { hideUnauthorized: true }), can("audit:read"), asyncHandler(monitoringAuditStreamController));

router.use(requireAuthenticatedUserMiddleware, requireRoles(ADMIN_SURFACE_ROLES, { hideUnauthorized: true }));

const requireComplianceReportsEnabled = (_req, _res, next) => {
  if (!env.COMPLIANCE_REPORTS_ENABLED) {
    throw new AppError("Not found", 404, "NOT_FOUND");
  }
  next();
};

router.get("/monitoring/health", can("monitoring:read"), asyncHandler(monitoringHealthController));
router.get("/monitoring/metrics/summary", can("monitoring:read"), asyncHandler(monitoringMetricsSummaryController));
router.get("/monitoring/failed-logins", can("monitoring:read"), asyncHandler(monitoringFailedLoginsController));
router.get("/monitoring/threat-spikes", can("monitoring:read"), asyncHandler(monitoringThreatSpikesController));
router.get("/monitoring/payment-mismatches", can("monitoring:read"), asyncHandler(monitoringPaymentMismatchesController));
router.get("/monitoring/threat-activity", can("monitoring:read"), asyncHandler(monitoringThreatActivityController));
router.get("/monitoring/resource-matrix", can("monitoring:read"), asyncHandler(monitoringResourceMatrixController));
router.get("/monitoring/radar-topology", can("monitoring:read"), asyncHandler(monitoringRadarTopologyController));

router.post("/monitoring/rescan", can("monitoring:read"), asyncHandler(monitoringRescanController));
router.get("/monitoring/user-engagement", can("monitoring:read"), asyncHandler(monitoringUserEngagementController));
router.get("/monitoring/logs", can("monitoring:read"), asyncHandler(monitoringLogStreamController));
router.get("/monitoring/traffic-pulse", can("monitoring:read"), asyncHandler(monitoringTrafficPulseController));
router.get("/monitoring/disk-status", can("monitoring:read"), asyncHandler(monitoringDiskStatusController));
router.get("/monitoring/system-manifest", can("monitoring:read"), asyncHandler(monitoringSystemManifestController));
router.get("/monitoring/audit/stats", can("audit:read"), asyncHandler(monitoringAuditStatsController));

router.get("/monitoring/analytics/history", can("monitoring:read"), asyncHandler(monitoringHistoricalAnalyticsController));

router.get("/users", requireRoles(SECURITY_ADMIN_ROLES), can("users:read"), asyncHandler(listUsersController));
router.get("/users/:userId", requireRoles(SECURITY_ADMIN_ROLES), can("users:read"), asyncHandler(getUserDetailController));
router.patch("/users/:userId/role", can("users:write"), asyncHandler(changeUserRoleController));
router.patch("/users/:userId/active", can("users:write"), asyncHandler(setUserActiveController));
router.post("/users/bulk/deactivate", can("users:write"), asyncHandler(bulkDeactivateUsersController));
router.post("/users/bulk/ip-block", can(["users:write", "security:write"]), asyncHandler(bulkIpBlockUsersController));

router.get("/audit-logs", can("audit:read"), asyncHandler(listAuditLogsController));
router.get("/threat-events", can("threats:read"), asyncHandler(listThreatEventsController));
router.get("/security/overview", can("security:read"), asyncHandler(securityOverviewController));
router.get("/security/suspicious-ips", can("security:read"), asyncHandler(suspiciousIpsController));
router.post("/security/ip-blocks", can("security:write"), asyncHandler(createIpBlockController));
router.delete("/security/ip-blocks/:ip", can("security:write"), asyncHandler(deleteIpBlockController));
router.get("/security/threat-stream", can("threats:read"), asyncHandler(threatStreamController));
router.get("/threat/rules", can("threats:read"), asyncHandler(listThreatRulesController));
router.put("/threat/rules", can("threats:write"), asyncHandler(updateThreatRulesController));

router.get("/payment-rules", can("payment_rules:read"), asyncHandler(getPaymentPolicyController));
router.patch("/payment-rules", can("payment_rules:write"), asyncHandler(updatePaymentPolicyController));
router.put("/payment-rules", can("payment_rules:write"), asyncHandler(updatePaymentPolicyController));
router.get("/payment-gateway", can("payment_gateway:read"), asyncHandler(getPaymentGatewayController));
router.put("/payment-gateway", can("payment_gateway:write"), asyncHandler(updatePaymentGatewayController));
router.get("/payment-rules/history", can("payment_rules:read"), asyncHandler(paymentRulesHistoryController));

router.get("/stats", can(["monitoring:read", "commerce:read"], { mode: "any" }), asyncHandler(adminStatsController));
router.patch("/users/:userId", can("users:write"), asyncHandler(adminUsersPatchController));
router.get("/orders", can("orders:read"), asyncHandler(adminOrdersListController));
router.get("/orders/export", can("orders:read"), asyncHandler(adminOrdersExportController));
router.get("/orders/:orderId", can("orders:read"), asyncHandler(adminOrderGetController));
router.patch("/orders/:orderId", can("orders:write"), asyncHandler(adminOrderPatchController));
router.post("/orders/:orderId/fulfill", can("orders:write"), asyncHandler(adminOrderFulfillController));
router.post("/orders/:orderId/refund", can("orders:write"), asyncHandler(adminOrderRefundController));
router.get("/audit", can("audit:read"), asyncHandler(adminAuditListController));
router.get("/threat/events", can("threats:read"), asyncHandler(adminThreatEventsAliasController));
router.get("/threat/stats", can("threats:read"), asyncHandler(adminThreatStatsAliasController));

router.get("/lockout/status", can("lockout:read"), asyncHandler(lockoutStatusController));
router.post("/lockout", can("lockout:write"), asyncHandler(lockoutActionController));
router.get("/sessions", can("sessions:read"), asyncHandler(sessionsListController));
router.delete("/sessions", can("sessions:write"), asyncHandler(sessionsRevokeAllController));
router.delete("/sessions/:sessionId", can("sessions:write"), asyncHandler(sessionsRevokeOneController));

router.get("/incidents", can("incidents:read"), asyncHandler(incidentsListController));
router.post("/incidents", can("incidents:write"), asyncHandler(incidentsCreateController));
router.patch("/incidents/:incidentId", can("incidents:write"), asyncHandler(incidentsUpdateController));

router.get("/honeypot/traps", can("honeypot:read"), asyncHandler(honeypotTrapsListController));
router.post("/honeypot/traps", can("honeypot:write"), asyncHandler(honeypotTrapsCreateController));
router.delete("/honeypot/traps/:trapId", can("honeypot:write"), asyncHandler(honeypotTrapsDeleteController));
router.get("/honeypot/events", can("honeypot:read"), asyncHandler(honeypotEventsListController));

router.get("/compliance/report", requireComplianceReportsEnabled, can("compliance:read"), asyncHandler(complianceReportController));
router.get("/compliance/policies", requireComplianceReportsEnabled, can("compliance:read"), asyncHandler(compliancePoliciesController));

router.get("/emergency/config", can("emergency:broadcast"), asyncHandler(emergencyConfigController));
router.get("/emergency/history", can("emergency:broadcast"), asyncHandler(emergencyHistoryController));
router.post("/emergency/broadcast", can("emergency:broadcast"), asyncHandler(emergencyBroadcastController));

router.get("/search", can("search:read"), asyncHandler(globalSearchController));

router.get("/rbac/roles", can("rbac:read"), asyncHandler(rolePolicyListController));
router.put("/rbac/roles/:roleId", can("rbac:write"), asyncHandler(rolePolicyUpdateController));

router.get("/categories/analytics", can("categories:read"), asyncHandler(adminCategoriesAnalyticsController));
router.get("/categories/tree", can("categories:read"), asyncHandler(adminCategoriesTreeController));
router.get("/categories", can("categories:read"), asyncHandler(adminCategoriesListController));
router.get("/categories/:categoryId", can("categories:read"), asyncHandler(adminCategoryGetController));
router.post("/categories", can("categories:write"), asyncHandler(adminCategoriesCreateController));
router.patch("/categories/:categoryId", can("categories:write"), asyncHandler(adminCategoriesPatchController));
router.delete("/categories/:categoryId", can("categories:write"), asyncHandler(adminCategoriesDeleteController));
router.put("/categories/reorder", can("categories:write"), asyncHandler(adminCategoriesReorderController));

router.get("/inventory/stats", can("products:read"), asyncHandler(adminInventoryStatsController));
router.get("/inventory", can("products:read"), asyncHandler(adminInventoryListController));
router.patch("/inventory/:sku", can("products:write"), asyncHandler(adminInventoryUpdateController));

router.get("/products", can("products:read"), asyncHandler(adminProductsListController));
router.get("/products/export", can("products:read"), asyncHandler(adminProductsExportController));
router.post("/products", can("products:write"), asyncHandler(adminProductsCreateController));
router.get("/products/:productId", can("products:read"), asyncHandler(adminProductGetController));
router.get("/products/:productId/variants", can("products:read"), asyncHandler(adminProductVariantsController));
router.post("/products/:productId/variants", can("products:write"), asyncHandler(adminProductVariantsController));
router.patch("/products/:productId", can("products:write"), asyncHandler(adminProductsPatchController));
router.delete("/products/:productId", can("products:write"), asyncHandler(adminProductsDeleteController));
router.post("/products/:productId/images", can("media:write"), asyncHandler(adminProductImageCreateController));
router.delete("/products/:productId/images/:imageId", can("media:write"), asyncHandler(adminProductImageDeleteController));
router.patch("/products/:productId/images/:imageId/primary", can("media:write"), asyncHandler(adminProductImagePrimaryController));
router.get("/products/:productId/analytics", can("products:read"), asyncHandler(adminSingleProductAnalyticsController));

router.get("/offers", can("offers:read"), asyncHandler(adminOffersListController));
router.post("/offers", can("offers:write"), asyncHandler(adminOffersCreateController));
router.patch("/offers/:offerId", can("offers:write"), asyncHandler(adminOffersPatchController));
router.delete("/offers/:offerId", can("offers:write"), asyncHandler(adminOffersDeleteController));

router.get("/coupons", can("offers:read"), asyncHandler(adminCouponsListController));
router.post("/coupons", can("offers:write"), asyncHandler(adminOffersCreateController));
router.patch("/coupons/:offerId", can("offers:write"), asyncHandler(adminOffersPatchController));
router.delete("/coupons/:offerId", can("offers:write"), asyncHandler(adminOffersDeleteController));

router.get("/campaigns", can("offers:read"), asyncHandler(listAdminCampaignsController));
router.post("/campaigns", can("offers:write"), asyncHandler(createCampaignController));
router.patch("/campaigns/:id", can("offers:write"), asyncHandler(editCampaignController));
router.delete("/campaigns/:id", can("offers:write"), asyncHandler(deleteCampaignController));

router.get("/flash-deals", can("offers:read"), asyncHandler(listAdminFlashDealsController));
router.post("/flash-deals", can("offers:write"), asyncHandler(createFlashDealController));
router.patch("/flash-deals/:id", can("offers:write"), asyncHandler(editFlashDealController));
router.delete("/flash-deals/:id", can("offers:write"), asyncHandler(deleteFlashDealController));
router.get("/flash-deals/analytics/stats", can("offers:read"), asyncHandler(getFlashDealAnalyticsController));

router.get("/sponsored-ads", can("offers:read"), asyncHandler(listAdminSponsoredAdsController));
router.post("/sponsored-ads", can("offers:write"), asyncHandler(createSponsoredAdController));
router.patch("/sponsored-ads/:id", can("offers:write"), asyncHandler(editSponsoredAdController));
router.delete("/sponsored-ads/:id", can("offers:write"), asyncHandler(deleteSponsoredAdController));

import { 
  listKeywordsController, 
  createKeywordController, 
  deleteKeywordController 
} from "../controllers/admin-moderation.controller.js";
router.get("/moderation/keywords", can("security:read"), asyncHandler(listKeywordsController));
router.post("/moderation/keywords", can("security:write"), asyncHandler(createKeywordController));
router.delete("/moderation/keywords/:id", can("security:write"), asyncHandler(deleteKeywordController));

// Merchant Analytics (Commerce panel)
router.get("/merchant/analytics/business", can("commerce:read"), asyncHandler(getMerchantBusinessAnalytics));
router.get("/merchant/analytics/products", can("commerce:read"), asyncHandler(getMerchantProductAnalytics));

router.use("/finance", can("commerce:read"), adminFinanceRoutes);
router.use("/analytics", can("commerce:read"), adminAnalyticsRoutes);
router.use("/soc", can("security:read"), socCasesRoutes);

// Bulk product import (max 100 products per request)
router.post("/products/bulk-import", can("commerce:write"), asyncHandler(async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "products array is required." });
  }
  if (products.length > 100) {
    return res.status(400).json({ error: "Maximum 100 products per bulk import." });
  }
  const listerId = req.user.id;
  const results = { created: 0, failed: 0, errors: [] };
  for (const p of products) {
    try {
      if (!p.name || !p.categoryId || !p.description) {
        results.failed++;
        results.errors.push({ product: p.name || "unknown", error: "Missing name, categoryId, or description." });
        continue;
      }
      const { prisma } = await import("../config/prisma.js");
      const created = await prisma.product.create({
        data: {
          listerId,
          categoryId: p.categoryId,
          name: p.name.trim(),
          description: p.description.trim(),
          shortDescription: p.shortDescription?.trim() || null,
          isDigital: p.isDigital || false,
          variants: p.variants?.length > 0 ? {
            create: p.variants.slice(0, 20).map(v => ({
              sku: v.sku || `SKU-${Date.now()}-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
              title: v.title || "Default",
              attributes: v.attributes || {},
              price: v.price || 0,
              stock: v.stock || 0,
            })),
          } : undefined,
        },
      });
      results.created++;
    } catch (err) {
      results.failed++;
      results.errors.push({ product: p.name, error: err.message });
    }
  }
  res.status(207).json({ message: "Bulk import completed.", ...results });
}));

// Email templates stub (GET list / PATCH update)
router.get("/notifications/email-templates", can("commerce:read"), asyncHandler(async (_req, res) => {
  const TEMPLATES = [
    { id: "order_confirmation", name: "Order Confirmation", subject: "Your order #{{orderId}} is confirmed!", updatedAt: null },
    { id: "shipping_update", name: "Shipping Update", subject: "Your order #{{orderId}} has shipped!", updatedAt: null },
    { id: "password_reset", name: "Password Reset", subject: "Reset your Katabazaar password", updatedAt: null },
    { id: "welcome", name: "Welcome Email", subject: "Welcome to Katabazaar!", updatedAt: null },
    { id: "offer_alert", name: "Offer Alert", subject: "Exclusive offer just for you 🎁", updatedAt: null },
  ];
  res.json({ templates: TEMPLATES });
}));

router.patch("/notifications/email-templates/:id", can("commerce:write"), asyncHandler(async (req, res) => {
  const { subject, body } = req.body;
  if (!subject && !body) return res.status(400).json({ error: "Provide subject or body to update." });
  // TODO: persist to DB/config when CMS is implemented
  res.json({ message: "Template updated (in-memory only until CMS is wired).", templateId: req.params.id });
}));

// Export schedule stub
router.get("/reports/export-schedule", can("commerce:read"), asyncHandler(async (_req, res) => {
  res.json({ schedules: [] });
}));

export default router;
