import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { writeAuditLog } from "../services/audit.service.js";

const prisma = new PrismaClient();

const keywordSchema = z.object({
  keyword: z.string().min(2).max(50),
  action: z.enum(["FLAG", "BLOCK", "HIDE"]).default("FLAG"),
});

export const listKeywordsController = async (req, res) => {
  const keywords = await prisma.keywordRule.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json({ keywords });
};

export const createKeywordController = async (req, res) => {
  const input = keywordSchema.parse(req.body);
  const keyword = await prisma.keywordRule.create({
    data: {
      keyword: input.keyword.trim().toLowerCase(),
      action: input.action,
    },
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "ADMIN_KEYWORD_CREATED",
    targetType: "KEYWORD_RULE",
    targetId: keyword.id,
    details: { keyword: keyword.keyword, action: keyword.action },
  });

  res.status(201).json({ keyword });
};

export const deleteKeywordController = async (req, res) => {
  const { id } = req.params;
  const keyword = await prisma.keywordRule.delete({ where: { id } });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "ADMIN_KEYWORD_DELETED",
    targetType: "KEYWORD_RULE",
    targetId: id,
    details: { keyword: keyword.keyword },
  });

  res.status(204).send();
};
