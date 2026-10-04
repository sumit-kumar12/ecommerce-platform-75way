import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

const ABUSIVE_KEYWORDS = ["scam", "fraud", "fake", "terrible", "worst", "shit", "fuck", "bitch", "crap"];

const containsAbusiveKeywords = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return ABUSIVE_KEYWORDS.some(keyword => lowerText.includes(keyword));
};

export const createReview = async ({ productId, userId, rating, comment }) => {
  const isFlagged = containsAbusiveKeywords(comment);
  
  const existingReview = await prisma.review.findFirst({
    where: { productId, userId }
  });
  if (existingReview) {
    throw new AppError("You have already reviewed this product.", 400, "ALREADY_REVIEWED");
  }

  return prisma.review.create({
    data: {
      productId,
      userId,
      rating,
      comment,
      status: isFlagged ? "FLAGGED" : "APPROVED"
    }
  });
};

export const getReviewsForProduct = async (productId) => {
  return prisma.review.findMany({
    where: { productId, status: "APPROVED" },
    include: {
      user: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const getAllReviewsAdmin = async () => {
  return prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};

export const updateReviewStatus = async (id, status) => {
  return prisma.review.update({
    where: { id },
    data: { status }
  });
};

export const deleteReview = async (id) => {
  return prisma.review.delete({
    where: { id }
  });
};
