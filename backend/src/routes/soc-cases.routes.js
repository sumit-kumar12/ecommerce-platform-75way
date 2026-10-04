// ─── SOC Cases Routes ─────────────────────────────────────────────────────────
// All SOC-related API endpoints. Mounted at /soc under the admin router.

import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requirePermissions } from "../middlewares/permission.middleware.js";

// ── Existing controllers ──────────────────────────────────────────────────────
import {
  getThreatGeolocationController,
  getSocUserRiskController,
  getSocDashboardKpisController,
} from "../controllers/soc-cases.controller.js";
import { getSocAnalyticsOverview } from "../controllers/soc-analytics.controller.js";

// ── New CRUD controller ───────────────────────────────────────────────────────
import {
  getSocCasesListController,
  createSocCaseController,
  getSocCaseDetailController,
  updateSocCaseController,
  closeSocCaseController,
  getSocCaseAnalyticsSummary,
  getSocCaseAnalyticsTrend,
} from "../controllers/soc-case-crud.controller.js";

// ── New detail/sub-resource controller ───────────────────────────────────────
import {
  getCaseTimelineController,
  addCaseTimelineController,
  getCaseEvidenceController,
  addCaseEvidenceController,
  deleteCaseEvidenceController,
  getCaseIocsController,
  addCaseIocController,
  deleteCaseIocController,
  enrichCaseIocController,
  getCaseNotesController,
  addCaseNoteController,
  getCaseAuditController,
  getCaseAssetsController,
  addCaseAssetController,
  getCaseUsersController,
  addCaseUserController,
  getCaseRelatedController,
  getCasePlaybooksController,
  runCasePlaybookController,
  getCaseResponseActionsController,
  executeCaseResponseActionController,
} from "../controllers/soc-case-detail.controller.js";

// ── Log collection controller ─────────────────────────────────────────────────
import {
  getSocLogsController,
  ingestExternalLogController,
  getLogAnalyticsController,
  getLogSourcesController,
  createLogSourceController,
  updateLogSourceController,
  deleteLogSourceController,
} from "../controllers/log-collection.controller.js";

// ── SIEM config controller ────────────────────────────────────────────────────
import {
  getSiemConfigController,
  updateSiemConfigController,
  getSiemRulesController,
  createSiemRuleController,
  updateSiemRuleController,
  deleteSiemRuleController,
  getSiemStatusController,
} from "../controllers/siem-config.controller.js";

// ── Playbooks (direct prisma + playbook engine) ───────────────────────────────
import { prisma } from "../config/prisma.js";

const router = Router();
const can = (p, opts) => requirePermissions(p, { hideUnauthorized: true, ...opts });

// ─── Legacy / Existing endpoints (keep — used by old SOC dashboard) ───────────
router.get("/geolocation",         asyncHandler(getThreatGeolocationController));
router.get("/user-risk",           asyncHandler(getSocUserRiskController));
router.get("/dashboard-kpis",      asyncHandler(getSocDashboardKpisController));
router.get("/analytics/overview",  asyncHandler(getSocAnalyticsOverview));

// ─── SOC Cases ────────────────────────────────────────────────────────────────
router.get( "/cases/analytics/summary", can("security:read"),  asyncHandler(getSocCaseAnalyticsSummary));
router.get( "/cases/analytics/trend",   can("security:read"),  asyncHandler(getSocCaseAnalyticsTrend));
router.get( "/cases",                   can("security:read"),  asyncHandler(getSocCasesListController));
router.post("/cases",                   can("security:write"), asyncHandler(createSocCaseController));
router.get( "/cases/:id",              can("security:read"),  asyncHandler(getSocCaseDetailController));
router.patch("/cases/:id",             can("security:write"), asyncHandler(updateSocCaseController));
router.post("/cases/:id/close",        can("security:write"), asyncHandler(closeSocCaseController));

// ─── Case: Timeline ───────────────────────────────────────────────────────────
router.get( "/cases/:id/timeline", can("security:read"),  asyncHandler(getCaseTimelineController));
router.post("/cases/:id/timeline", can("security:write"), asyncHandler(addCaseTimelineController));

// ─── Case: Evidence ───────────────────────────────────────────────────────────
router.get(   "/cases/:id/evidence",       can("security:read"),  asyncHandler(getCaseEvidenceController));
router.post(  "/cases/:id/evidence",       can("security:write"), asyncHandler(addCaseEvidenceController));
router.delete("/cases/:id/evidence/:eid",  can("security:write"), asyncHandler(deleteCaseEvidenceController));

// ─── Case: IOCs ───────────────────────────────────────────────────────────────
router.get(   "/cases/:id/iocs",             can("security:read"),  asyncHandler(getCaseIocsController));
router.post(  "/cases/:id/iocs",             can("security:write"), asyncHandler(addCaseIocController));
router.delete("/cases/:id/iocs/:iid",        can("security:write"), asyncHandler(deleteCaseIocController));
router.post(  "/cases/:id/iocs/:iid/enrich", can("security:write"), asyncHandler(enrichCaseIocController));

// ─── Case: Notes ─────────────────────────────────────────────────────────────
router.get( "/cases/:id/notes", can("security:read"),  asyncHandler(getCaseNotesController));
router.post("/cases/:id/notes", can("security:write"), asyncHandler(addCaseNoteController));

// ─── Case: Audit (immutable) ──────────────────────────────────────────────────
router.get("/cases/:id/audit", can("audit:read"), asyncHandler(getCaseAuditController));

// ─── Case: Assets ─────────────────────────────────────────────────────────────
router.get( "/cases/:id/assets", can("security:read"),  asyncHandler(getCaseAssetsController));
router.post("/cases/:id/assets", can("security:write"), asyncHandler(addCaseAssetController));

// ─── Case: Users ─────────────────────────────────────────────────────────────
router.get( "/cases/:id/users", can("security:read"),  asyncHandler(getCaseUsersController));
router.post("/cases/:id/users", can("security:write"), asyncHandler(addCaseUserController));

// ─── Case: Related ────────────────────────────────────────────────────────────
router.get("/cases/:id/related", can("security:read"), asyncHandler(getCaseRelatedController));

// ─── Case: Playbooks ──────────────────────────────────────────────────────────
router.get( "/cases/:id/playbooks",            can("security:read"),  asyncHandler(getCasePlaybooksController));
router.post("/cases/:id/playbooks/:pid/run",   can("security:write"), asyncHandler(runCasePlaybookController));

// ─── Case: Response Actions ───────────────────────────────────────────────────
router.get( "/cases/:id/response", can("security:read"),  asyncHandler(getCaseResponseActionsController));
router.post("/cases/:id/response", can("security:write"), asyncHandler(executeCaseResponseActionController));

// ─── Log Management ───────────────────────────────────────────────────────────
router.get(   "/logs",              can("security:read"),  asyncHandler(getSocLogsController));
router.post(  "/logs/ingest",                              asyncHandler(ingestExternalLogController)); // Auth via ingest key header
router.get(   "/logs/analytics",    can("security:read"),  asyncHandler(getLogAnalyticsController));
router.get(   "/logs/sources",      can("security:read"),  asyncHandler(getLogSourcesController));
router.post(  "/logs/sources",      can("security:write"), asyncHandler(createLogSourceController));
router.patch( "/logs/sources/:id",  can("security:write"), asyncHandler(updateLogSourceController));
router.delete("/logs/sources/:id",  can("security:write"), asyncHandler(deleteLogSourceController));

// ─── SIEM Configuration ────────────────────────────────────────────────────────
router.get(   "/siem/config",       can("security:read"),  asyncHandler(getSiemConfigController));
router.patch( "/siem/config",       can("security:write"), asyncHandler(updateSiemConfigController));
router.get(   "/siem/rules",        can("security:read"),  asyncHandler(getSiemRulesController));
router.post(  "/siem/rules",        can("security:write"), asyncHandler(createSiemRuleController));
router.patch( "/siem/rules/:id",    can("security:write"), asyncHandler(updateSiemRuleController));
router.delete("/siem/rules/:id",    can("security:write"), asyncHandler(deleteSiemRuleController));
router.get(   "/siem/status",       can("security:read"),  asyncHandler(getSiemStatusController));

// ─── Playbooks (global library — not case-specific) ────────────────────────────
router.get("/playbooks", can("security:read"), asyncHandler(async (req, res) => {
  const playbooks = await prisma.socPlaybook.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });
  return res.json({ playbooks });
}));

router.post("/playbooks", can("security:write"), asyncHandler(async (req, res) => {
  const { name, description, category, steps, autoRun } = req.body;
  if (!name || !steps) return res.status(400).json({ error: "name and steps are required" });
  const pb = await prisma.socPlaybook.create({
    data: { name, description, category, steps, autoRun: autoRun ?? false },
  });
  return res.status(201).json({ playbook: pb });
}));

router.patch("/playbooks/:id", can("security:write"), asyncHandler(async (req, res) => {
  const { name, description, category, steps, autoRun, active } = req.body;
  const pb = await prisma.socPlaybook.update({
    where: { id: req.params.id },
    data: {
      ...(name        && { name }),
      ...(description && { description }),
      ...(category    && { category }),
      ...(steps       && { steps }),
      ...(autoRun !== undefined && { autoRun }),
      ...(active !== undefined  && { active }),
    },
  });
  return res.json({ playbook: pb });
}));

router.delete("/playbooks/:id", can("security:write"), asyncHandler(async (req, res) => {
  await prisma.socPlaybook.update({ where: { id: req.params.id }, data: { active: false } });
  return res.json({ ok: true });
}));

export default router;
