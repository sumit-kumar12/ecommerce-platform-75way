import { z } from "zod";
import * as outletService from "../services/outlet.service.js";

const createOutletSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  isActive: z.boolean().optional(),
});

const updateOutletInventorySchema = z.object({
  variantId: z.string().uuid(),
  stock: z.number().int().min(0),
  alertThreshold: z.number().int().min(0).optional(),
});

export const createOutletController = async (req, res) => {
  const data = createOutletSchema.parse(req.body);
  const outlet = await outletService.createOutlet(data);
  res.status(201).json({ outlet });
};

export const updateOutletController = async (req, res) => {
  const { id } = req.params;
  const data = createOutletSchema.partial().parse(req.body);
  const outlet = await outletService.updateOutlet(id, data);
  res.json({ outlet });
};

export const listOutletsController = async (req, res) => {
  const outlets = await outletService.listOutlets();
  res.json({ outlets });
};

export const deleteOutletController = async (req, res) => {
  const { id } = req.params;
  await outletService.deleteOutlet(id);
  res.json({ success: true });
};

export const updateOutletInventoryController = async (req, res) => {
  const { id: outletId } = req.params;
  const data = updateOutletInventorySchema.parse(req.body);
  const inventory = await outletService.updateOutletInventory({ outletId, ...data });
  res.json({ inventory });
};

export const listOutletInventoryController = async (req, res) => {
  const { id: outletId } = req.params;
  const inventories = await outletService.listOutletInventory(outletId);
  res.json({ inventories });
};
