import { z } from "zod";
import { 
  createOffer, 
  deleteOffer, 
  listAllOffers,
  listAllCoupons,
  updateOffer 
} from "../services/offer.service.js";
import { writeAuditLog } from "../services/audit.service.js";

const offerCreateSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(300).optional().or(z.literal("")),
  code: z.string().min(3).max(20).toUpperCase().optional().or(z.literal("")),
  discountPercent: z.coerce.number().int().min(1).max(90),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  usageLimit: z.coerce.number().int().min(1).max(1000000).nullable().optional(),
  perCustomerLimit: z.coerce.number().int().min(1).max(1000000).nullable().optional(),
});

const offerPatchSchema = z.object({
  title: z.string().min(2).max(120).optional(),
  description: z.string().max(300).optional().or(z.literal("")),
  code: z.string().min(3).max(20).toUpperCase().optional().or(z.literal("")),
  discountPercent: z.coerce.number().int().min(1).max(90).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  usageLimit: z.coerce.number().int().min(1).max(1000000).nullable().optional(),
  perCustomerLimit: z.coerce.number().int().min(1).max(1000000).nullable().optional(),
});

const offerIdParamSchema = z.object({
  offerId: z.string().uuid(),
});

export const adminOffersListController = async (_req, res) => {
  const offers = await listAllOffers();
  res.status(200).json({ offers });
};

export const adminCouponsListController = async (_req, res) => {
  const coupons = await listAllCoupons();
  res.status(200).json({ coupons });
};

export const adminOffersCreateController = async (req, res) => {
  const input = offerCreateSchema.parse(req.body);
  const offer = await createOffer({
    ...input,
    code: input.code ? input.code.trim() : null,
    description: input.description ? input.description.trim() : null,
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "ADMIN_OFFER_CREATED",
    targetType: "OFFER",
    targetId: offer.id,
    details: {
      title: offer.title,
      discount: offer.discountPercent,
      usageLimit: offer.usageLimit,
      perCustomerLimit: offer.perCustomerLimit,
    },
  });

  res.status(201).json({ offer });
};

export const adminOffersPatchController = async (req, res) => {
  const { offerId } = offerIdParamSchema.parse(req.params);
  const input = offerPatchSchema.parse(req.body);
  const offer = await updateOffer(offerId, {
    ...input,
    code: input.code !== undefined ? input.code.trim() || null : undefined,
    description: input.description !== undefined ? input.description.trim() || null : undefined,
  });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "ADMIN_OFFER_UPDATED",
    targetType: "OFFER",
    targetId: offerId,
    details: input,
  });

  res.status(200).json({ offer });
};

export const adminOffersDeleteController = async (req, res) => {
  const { offerId } = offerIdParamSchema.parse(req.params);
  await deleteOffer(offerId);

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "ADMIN_OFFER_DELETED",
    targetType: "OFFER",
    targetId: offerId,
    details: {},
  });

  res.status(204).send();
};
