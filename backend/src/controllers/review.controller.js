import { z } from "zod";
import * as reviewService from "../services/review.service.js";
import { AppError } from "../errors/app-error.js";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional()
});

const statusSchema = z.object({
  status: z.enum(["APPROVED", "FLAGGED", "REJECTED"])
});

export const createReviewController = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  const data = reviewSchema.parse(req.body);
  
  const review = await reviewService.createReview({
    productId,
    userId,
    rating: data.rating,
    comment: data.comment
  });
  
  res.status(201).json({ review });
};

export const getProductReviewsController = async (req, res) => {
  const { productId } = req.params;
  const reviews = await reviewService.getReviewsForProduct(productId);
  res.json({ reviews });
};

export const getAdminReviewsController = async (req, res) => {
  const reviews = await reviewService.getAllReviewsAdmin();
  res.json({ reviews });
};

export const updateReviewStatusController = async (req, res) => {
  const { id } = req.params;
  const { status } = statusSchema.parse(req.body);
  const review = await reviewService.updateReviewStatus(id, status);
  res.json({ review });
};

export const deleteReviewController = async (req, res) => {
  const { id } = req.params;
  await reviewService.deleteReview(id);
  res.json({ success: true });
};
