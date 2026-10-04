import { z } from "zod";
import { 
  createFlashDeal, 
  deleteFlashDeal, 
  listAdminFlashDeals, 
  listActiveFlashDeals, 
  updateFlashDeal,
  getFlashDealAnalytics 
} from "../services/flash-deal.service.js";
import { writeAuditLog } from "../services/audit.service.js";
import { serializeProductPayload } from "./product.controller.js";

const flashDealSchema = z.object({
  name: z.string().min(2).max(120),
  productId: z.string().uuid(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).default("PERCENTAGE"),
  discountValue: z.coerce.number().min(0),
  startDate: z.string(),
  endDate: z.string(),
  stockQuantity: z.coerce.number().int().min(0).default(0),
  priority: z.coerce.number().int().default(0),
  isActive: z.boolean().optional().default(true),
  mediaBase64: z.string().optional(),
  mediaName: z.string().optional(),
});

export const createFlashDealController = async (req, res) => {
  const input = flashDealSchema.parse(req.body);
  const deal = await createFlashDeal({ input, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "FLASH_DEAL_CREATE",
    targetType: "FLASH_DEAL",
    targetId: deal.id,
    details: { name: deal.name },
  });

  res.status(201).json({ deal: deal.product ? { ...deal, product: serializeProductPayload(req, deal.product) } : deal });
};

export const editFlashDealController = async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const input = flashDealSchema.partial().parse(req.body);
  
  const deal = await updateFlashDeal({ id, input, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "FLASH_DEAL_UPDATE",
    targetType: "FLASH_DEAL",
    targetId: id,
    details: { name: input.name || deal.name },
  });

  res.status(200).json({ deal: deal.product ? { ...deal, product: serializeProductPayload(req, deal.product) } : deal });
};

export const listAdminFlashDealsController = async (req, res) => {
  const deals = await listAdminFlashDeals();
  const serializedDeals = deals.map(deal => deal.product ? { ...deal, product: serializeProductPayload(req, deal.product) } : deal);
  res.status(200).json({ deals: serializedDeals });
};

export const deleteFlashDealController = async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  
  await deleteFlashDeal({ id, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "FLASH_DEAL_DELETE",
    targetType: "FLASH_DEAL",
    targetId: id,
    details: {},
  });

  res.status(204).send();
};

export const listActiveFlashDealsController = async (req, res) => {
  const deals = await listActiveFlashDeals();
  const serializedDeals = deals.map(deal => deal.product ? { ...deal, product: serializeProductPayload(req, deal.product) } : deal);
  res.status(200).json({ deals: serializedDeals });
};

export const getFlashDealAnalyticsController = async (req, res) => {
  const analytics = await getFlashDealAnalytics();
  res.status(200).json(analytics);
};
