import { z } from "zod";
import { 
  createSponsoredAd, 
  listSponsoredAds, 
  updateSponsoredAd, 
  deleteSponsoredAd, 
  trackSponsoredAdMetrics 
} from "../services/sponsored-ad.service.js";
import { writeAuditLog } from "../services/audit.service.js";

const sponsoredAdSchema = z.object({
  campaignName: z.string().min(2).max(255),
  productId: z.string(),
  adPosition: z.coerce.number().int().default(1),
  bannerBase64: z.string().optional(),
  bannerName: z.string().optional(),
  bannerImage: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  dailyBudget: z.coerce.number().positive(),
  totalBudget: z.coerce.number().positive(),
  status: z.enum(["active", "scheduled", "paused", "completed"]).optional().default("active"),
});

export const createSponsoredAdController = async (req, res) => {
  const input = sponsoredAdSchema.parse(req.body);
  const ad = await createSponsoredAd({ input, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SPONSORED_AD_CREATE",
    targetType: "SPONSORED_AD",
    targetId: ad.id,
    details: { campaignName: ad.campaignName },
  });

  res.status(201).json({ ad });
};

export const listAdminSponsoredAdsController = async (req, res) => {
  const ads = await listSponsoredAds({ activeOnly: false });
  res.status(200).json({ ads });
};

export const listPublicSponsoredAdsController = async (req, res) => {
  const ads = await listSponsoredAds({ activeOnly: true });
  res.status(200).json({ ads });
};

export const editSponsoredAdController = async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const input = sponsoredAdSchema.partial().parse(req.body);

  const ad = await updateSponsoredAd({ id, input, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SPONSORED_AD_UPDATE",
    targetType: "SPONSORED_AD",
    targetId: id,
    details: { campaignName: input.campaignName || ad.campaignName },
  });

  res.status(200).json({ ad });
};

export const deleteSponsoredAdController = async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await deleteSponsoredAd({ id, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "SPONSORED_AD_DELETE",
    targetType: "SPONSORED_AD",
    targetId: id,
    details: {},
  });

  res.status(204).send();
};

export const trackSponsoredAdMetricsController = async (req, res) => {
  const schema = z.object({
    metrics: z.array(z.object({
      id: z.string().uuid(),
      type: z.enum(["view", "click", "impression"])
    }))
  });

  const { metrics } = schema.parse(req.body);
  await trackSponsoredAdMetrics({ metrics });
  res.status(204).send();
};
