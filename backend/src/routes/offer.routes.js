import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { listStorefrontOffersController } from "../controllers/offer.controller.js";

const router = Router();

router.get("/", asyncHandler(listStorefrontOffersController));

export default router;
