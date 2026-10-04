import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/app-error.js";

// GET /api/v1/addresses
export const getAddressesController = async (req, res) => {
  const userId = req.user.id;
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' },
      { createdAt: 'desc' }
    ]
  });

  res.status(200).json({
    status: "success",
    data: { addresses }
  });
};

// POST /api/v1/addresses
export const createAddressController = async (req, res) => {
  const userId = req.user.id;
  const { type, isDefault, name, phone, line1, line2, city, region, postalCode, country } = req.body;

  if (!name || !phone || !line1 || !city || !region || !postalCode) {
    throw new AppError("Missing required address fields", 400);
  }

  // If new address is marked as default, unset other defaults
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      type: type || "Home",
      isDefault: isDefault || false,
      name,
      phone,
      line1,
      line2,
      city,
      region,
      postalCode,
      country: country || "India"
    }
  });

  res.status(201).json({
    status: "success",
    data: { address }
  });
};

// PATCH /api/v1/addresses/:id
export const updateAddressController = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updates = req.body;

  const existing = await prisma.address.findUnique({
    where: { id }
  });

  if (!existing || existing.userId !== userId) {
    throw new AppError("Address not found", 404);
  }

  if (updates.isDefault) {
    await prisma.address.updateMany({
      where: { userId, isDefault: true, id: { not: id } },
      data: { isDefault: false }
    });
  }

  const address = await prisma.address.update({
    where: { id },
    data: updates
  });

  res.status(200).json({
    status: "success",
    data: { address }
  });
};

// DELETE /api/v1/addresses/:id
export const deleteAddressController = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existing = await prisma.address.findUnique({
    where: { id }
  });

  if (!existing || existing.userId !== userId) {
    throw new AppError("Address not found", 404);
  }

  await prisma.address.delete({
    where: { id }
  });

  res.status(200).json({
    status: "success",
    data: null
  });
};
