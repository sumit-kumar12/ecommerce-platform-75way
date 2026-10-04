import { prisma } from "../config/prisma.js";

/**
 * GET /api/v1/products/:productId/qa
 * Public — list visible Q&A for a product
 */
export const listProductQA = async (req, res) => {
  const { productId } = req.params;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.productQA.findMany({
      where: { productId, isVisible: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true } },
        answers: {
          where: { isVisible: true },
          orderBy: { createdAt: "asc" },
          include: { author: { select: { id: true, name: true } } },
        },
      },
    }),
    prisma.productQA.count({ where: { productId, isVisible: true } }),
  ]);

  res.json({ items, total, page, limit });
};

/**
 * POST /api/v1/products/:productId/qa
 * Authenticated — submit a question
 */
export const createProductQA = async (req, res) => {
  const { productId } = req.params;
  const { question } = req.body;
  const authorId = req.user.id;

  if (!question || String(question).trim().length < 5) {
    return res.status(400).json({ error: "Question must be at least 5 characters." });
  }

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) return res.status(404).json({ error: "Product not found." });

  const qa = await prisma.productQA.create({
    data: { productId, authorId, question: question.trim() },
    include: { author: { select: { id: true, name: true } } },
  });

  res.status(201).json({ qa });
};

/**
 * POST /api/v1/products/:productId/qa/:qaId/answer
 * Authenticated (admin / seller) — post an answer
 */
export const answerProductQA = async (req, res) => {
  const { qaId } = req.params;
  const { answer } = req.body;
  const authorId = req.user.id;

  if (!answer || String(answer).trim().length < 3) {
    return res.status(400).json({ error: "Answer must be at least 3 characters." });
  }

  const qa = await prisma.productQA.findUnique({ where: { id: qaId } });
  if (!qa || !qa.isVisible) return res.status(404).json({ error: "Q&A item not found." });

  const qaAnswer = await prisma.productQAAnswer.create({
    data: { qaId, authorId, answer: answer.trim() },
    include: { author: { select: { id: true, name: true } } },
  });

  res.status(201).json({ answer: qaAnswer });
};
