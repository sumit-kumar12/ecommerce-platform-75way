import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({ take: 4 });
  if (products.length < 4) {
    console.error("Not enough products.");
    return;
  }

  // Clear existing flash deals
  await prisma.flashDeal.deleteMany();

  // Create 4 new flash deals
  for (let i = 0; i < 4; i++) {
    const p = products[i];
    await prisma.flashDeal.create({
      data: {
        name: `Flash Deal ${i+1}`,
        productId: p.id,
        discountValue: 10 + (i * 10),
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        stockQuantity: 100,
        discountType: "PERCENTAGE",
      }
    });
  }
  console.log("Flash deals created!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
