import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

export const createOutlet = async (data) => {
  return prisma.outlet.create({
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      isActive: data.isActive !== undefined ? data.isActive : true,
    },
  });
};

export const updateOutlet = async (id, data) => {
  const outlet = await prisma.outlet.findUnique({ where: { id } });
  if (!outlet) throw new AppError("Outlet not found.", 404, "NOT_FOUND");

  return prisma.outlet.update({
    where: { id },
    data,
  });
};

export const listOutlets = async () => {
  return prisma.outlet.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const deleteOutlet = async (id) => {
  const outlet = await prisma.outlet.findUnique({ where: { id } });
  if (!outlet) throw new AppError("Outlet not found.", 404, "NOT_FOUND");

  await prisma.outlet.delete({ where: { id } });
  return { success: true };
};

export const updateOutletInventory = async ({ outletId, variantId, stock, alertThreshold }) => {
  return prisma.outletInventory.upsert({
    where: {
      outletId_variantId: {
        outletId,
        variantId,
      },
    },
    update: {
      stock,
      alertThreshold: alertThreshold !== undefined ? alertThreshold : undefined,
    },
    create: {
      outletId,
      variantId,
      stock,
      alertThreshold: alertThreshold || 5,
    },
  });
};

export const listOutletInventory = async (outletId) => {
  return prisma.outletInventory.findMany({
    where: { outletId },
    include: {
      variant: {
        include: {
          product: {
            select: { id: true, name: true }
          }
        }
      }
    }
  });
};
