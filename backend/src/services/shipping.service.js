import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

export const getShippingConfigs = async () => {
  return prisma.shippingConfig.findMany({
    where: { isEnabled: true },
    orderBy: { price: "asc" }
  });
};

export const getShippingSettings = async () => {
  let settings = await prisma.shippingSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await prisma.shippingSettings.create({ data: { id: "singleton" } });
  }
  return settings;
};

export const updateShippingConfig = async (id, data) => {
  return prisma.shippingConfig.update({ where: { id }, data });
};

export const createShippingConfig = async (data) => {
  return prisma.shippingConfig.create({ data });
};

export const updateShippingSettings = async (data) => {
  return prisma.shippingSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data }
  });
};
