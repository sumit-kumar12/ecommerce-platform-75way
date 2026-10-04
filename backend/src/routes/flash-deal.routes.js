import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { listActiveFlashDealsController } from "../controllers/flash-deal.controller.js";

const router = Router();

// Public routes
router.get("/", asyncHandler(listActiveFlashDealsController));

export default router;
