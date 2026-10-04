import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { listPublicCampaignsController, trackCampaignMetricsController } from "../controllers/campaign.controller.js";

const router = Router();

router.get("/", asyncHandler(listPublicCampaignsController));
router.post("/track", asyncHandler(trackCampaignMetricsController));

export default router;
