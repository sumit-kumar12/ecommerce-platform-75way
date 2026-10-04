import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { listPublicSponsoredAdsController, trackSponsoredAdMetricsController } from "../controllers/sponsored-ad.controller.js";

const router = Router();

router.get("/", asyncHandler(listPublicSponsoredAdsController));
router.post("/track", asyncHandler(trackSponsoredAdMetricsController));

export default router;
