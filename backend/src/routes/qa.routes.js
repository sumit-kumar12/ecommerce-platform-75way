import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.js";
import { requireAuthenticatedUserMiddleware } from "../middlewares/jwt.middleware.js";
import { listProductQA, createProductQA, answerProductQA } from "../controllers/qa.controller.js";

const router = Router({ mergeParams: true });

// GET /api/v1/products/:productId/qa — public
router.get("/", asyncHandler(listProductQA));

// POST /api/v1/products/:productId/qa — auth required
router.post("/", requireAuthenticatedUserMiddleware, asyncHandler(createProductQA));

// POST /api/v1/products/:productId/qa/:qaId/answer — auth required
router.post("/:qaId/answer", requireAuthenticatedUserMiddleware, asyncHandler(answerProductQA));

export default router;
