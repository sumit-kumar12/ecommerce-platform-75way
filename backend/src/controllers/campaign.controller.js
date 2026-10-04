import { z } from "zod";
import { createCampaign, deleteCampaign, listCampaigns, updateCampaign, trackCampaignMetrics } from "../services/campaign.service.js";
import { writeAuditLog } from "../services/audit.service.js";

const campaignSchema = z.object({
  name: z.string().min(2).max(120),
  type: z.enum(["Image", "Video"]),
  title: z.string().max(200).optional(),
  subtitle: z.string().max(200).optional(),
  ctaText: z.string().max(80).optional(),
  linkUrl: z.string().max(2000).optional(),
  mediaBase64: z.string().optional(),
  mediaName: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  isActive: z.boolean().optional().default(true),
  priority: z.coerce.number().int().default(0),
  productId: z.string().uuid().optional(),
});

export const createCampaignController = async (req, res) => {
  const input = campaignSchema.parse(req.body);
  const campaign = await createCampaign({ input, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "CAMPAIGN_CREATE",
    targetType: "HERO_CAMPAIGN",
    targetId: campaign.id,
    details: { name: campaign.name },
  });

  res.status(201).json({ campaign });
};

export const listAdminCampaignsController = async (req, res) => {
  const campaigns = await listCampaigns({ activeOnly: false });
  res.status(200).json({ campaigns });
};

export const listPublicCampaignsController = async (req, res) => {
  const campaigns = await listCampaigns({ activeOnly: true });
  res.status(200).json({ campaigns });
};

export const deleteCampaignController = async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await deleteCampaign({ id, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "CAMPAIGN_DELETE",
    targetType: "HERO_CAMPAIGN",
    targetId: id,
    details: {},
  });

  res.status(204).send();
};

export const editCampaignController = async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const input = campaignSchema.partial().parse(req.body);
  
  const campaign = await updateCampaign({ id, input, actor: req.user });

  await writeAuditLog({
    req,
    actorId: req.user.id,
    action: "CAMPAIGN_UPDATE",
    targetType: "HERO_CAMPAIGN",
    targetId: id,
    details: { name: input.name || campaign.name },
  });

  res.status(200).json({ campaign });
};

export const trackCampaignMetricsController = async (req, res) => {
  const schema = z.object({
    metrics: z.array(z.object({
      id: z.string().uuid(),
      type: z.enum(["view", "click"])
    }))
  });
  
  const { metrics } = schema.parse(req.body);
  await trackCampaignMetrics({ metrics });
  res.status(204).send();
};
