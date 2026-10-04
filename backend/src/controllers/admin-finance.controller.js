import { PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import { env } from "../config/env.js";
import { AppError } from "../errors/app-error.js";

const prisma = new PrismaClient();

let razorpayInstance = null;
if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export const getFinanceSummaryController = async (req, res) => {
  const [totalRevenue, pendingClearance, successfulPayoutsCount] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "VERIFIED" },
      _sum: { expectedAmount: true },
    }),
    prisma.payment.aggregate({
      where: { status: "PENDING" },
      _sum: { expectedAmount: true },
    }),
    prisma.payment.count({
      where: { status: "VERIFIED" },
    }),
  ]);

  res.status(200).json({
    summary: {
      totalRevenue: totalRevenue._sum.expectedAmount || 0,
      pendingClearance: pendingClearance._sum.expectedAmount || 0,
      successfulPayouts: successfulPayoutsCount,
    }
  });
};

export const getTransactionsController = async (req, res) => {
  const limit = parseInt(req.query.limit || "10", 10);
  
  const transactions = await prisma.payment.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      expectedAmount: true,
      status: true,
      provider: true,
      createdAt: true,
      order: {
        select: {
          id: true,
        }
      }
    }
  });

  res.status(200).json({ 
    transactions: transactions.map(t => ({
      ...t,
      amount: t.expectedAmount
    }))
  });
};

export const getPayoutsController = async (req, res, next) => {
  if (!razorpayInstance) {
    // If Razorpay keys are not configured, return empty list gracefully to avoid breaking UI
    return res.status(200).json({ payouts: [] });
  }

  try {
    // Fetch real settlements from Razorpay
    const settlements = await razorpayInstance.settlements.all({ count: 10 });
    
    const formattedPayouts = settlements.items.map(s => ({
      id: s.id,
      amount: s.amount / 100, // Razorpay amounts are in paise
      status: s.status,
      utr: s.utr,
      createdAt: new Date(s.created_at * 1000).toISOString(),
    }));

    res.status(200).json({ payouts: formattedPayouts });
  } catch (error) {
    next(new AppError("Failed to fetch payouts from Razorpay.", 502, "RAZORPAY_ERROR"));
  }
};
