import { z } from "zod";
import * as shippingService from "../services/shipping.service.js";

const shippingConfigSchema = z.object({
  type: z.string().min(1),
  price: z.number().min(0),
  estimatedDays: z.number().int().min(1),
  isEnabled: z.boolean().optional()
});

const shippingSettingsSchema = z.object({
  allowGlobalCOD: z.boolean().optional(),
  freeShippingThreshold: z.number().min(0).nullable().optional(),
  maxCODPrice: z.number().min(0).nullable().optional()
});

export const getShippingConfigsController = async (req, res) => {
  const configs = await shippingService.getShippingConfigs();
  res.json({ configs });
};

export const getShippingSettingsController = async (req, res) => {
  const settings = await shippingService.getShippingSettings();
  res.json({ settings });
};

export const createShippingConfigController = async (req, res) => {
  const data = shippingConfigSchema.parse(req.body);
  const config = await shippingService.createShippingConfig(data);
  res.status(201).json({ config });
};

export const updateShippingConfigController = async (req, res) => {
  const { id } = req.params;
  const data = shippingConfigSchema.partial().parse(req.body);
  const config = await shippingService.updateShippingConfig(id, data);
  res.json({ config });
};

export const updateShippingSettingsController = async (req, res) => {
  const data = shippingSettingsSchema.parse(req.body);
  const settings = await shippingService.updateShippingSettings(data);
  res.json({ settings });
};
