import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const log = (msg) => process.stdout.write(`[seed] ${msg}\n`);

async function main() {
  log("Starting dummy orders seed...");

  // 1. Get some existing products and a user
  const customer = await prisma.user.findFirst({
    where: { role: "CUSTOMER" }
  });

  if (!customer) {
    log("No customer found. Please run regular seed.js first.");
    return;
  }

  const products = await prisma.product.findMany({
    include: { variants: true },
    take: 5
  });

  if (products.length === 0) {
    log("No products found. Please run regular seed.js first.");
    return;
  }

  // Helper to generate a random date in the last 30 days
  const randomDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    return d;
  };

  // Dummy order data
  const ordersToCreate = [
    { status: "DELIVERED", paymentStatus: "VERIFIED" },
    { status: "SHIPPED", paymentStatus: "VERIFIED" },
    { status: "PROCESSING", paymentStatus: "VERIFIED" },
    { status: "PROCESSING", paymentStatus: "VERIFIED" },
    { status: "PENDING_PAYMENT", paymentStatus: "PENDING" },
    { status: "DELIVERED", paymentStatus: "VERIFIED" },
    { status: "DELIVERED", paymentStatus: "VERIFIED" },
    { status: "DELIVERED", paymentStatus: "VERIFIED" },
    { status: "CANCELLED", paymentStatus: "FAILED" },
  ];

  log(`Creating ${ordersToCreate.length} orders...`);

  const createdOrders = [];

  for (let i = 0; i < ordersToCreate.length; i++) {
    const config = ordersToCreate[i];
    const orderNum = `ORD-${Date.now().toString().slice(-6)}-${i}`;
    
    // Pick 1-3 random products
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const p = products[Math.floor(Math.random() * products.length)];
      if (p.variants.length === 0) continue;
      const v = p.variants[0];
      const qty = Math.floor(Math.random() * 2) + 1;
      
      subtotal += parseFloat(v.price) * qty;
      items.push({
        productId: p.id,
        variantId: v.id,
        listerId: p.listerId,
        quantity: qty,
        unitPrice: v.price,
        lineTotal: parseFloat(v.price) * qty
      });
    }

    if (items.length === 0) continue;

    const order = await prisma.order.create({
      data: {
        orderNumber: orderNum,
        userId: customer.id,
        status: config.status,
        paymentMethod: "ONLINE",
        paymentStatus: config.paymentStatus,
        subtotal: subtotal,
        shippingFee: 50,
        totalAmount: subtotal + 50,
        createdAt: randomDate(),
        shippingAddress: {
          name: customer.name,
          street: "123 Main St",
          city: "Metropolis",
          state: "NY",
          zip: "10001",
          country: "US",
          phone: "555-0100"
        },
        items: {
          create: items
        }
      },
      include: {
        items: true
      }
    });
    
    createdOrders.push(order);
    log(`Created order ${order.orderNumber} with status ${order.status}`);
  }

  // Create Returns for some DELIVERED orders
  log("Creating return requests...");
  const deliveredOrders = createdOrders.filter(o => o.status === "DELIVERED");
  
  const returnsData = [
    { status: "PENDING", reason: "Defective item" },
    { status: "APPROVED", reason: "Wrong size/color" },
    { status: "REJECTED", reason: "Changed mind after opening" },
    { status: "COMPLETED", reason: "Product not as described" }
  ];

  for (let i = 0; i < Math.min(deliveredOrders.length, returnsData.length); i++) {
    const order = deliveredOrders[i];
    const retConfig = returnsData[i];
    const itemToReturn = order.items[0];

    // Note: the schema ReturnStatus has REFUNDED but code might expect COMPLETED depending on enum. Wait, let's look at schema.
    // Schema enum: PENDING, APPROVED, REJECTED, REFUNDED. 
    // Wait, let's use REFUNDED instead of COMPLETED.
    const statusToUse = retConfig.status === "COMPLETED" ? "REFUNDED" : retConfig.status;

    await prisma.returnRequest.create({
      data: {
        orderId: order.id,
        userId: customer.id,
        status: statusToUse,
        reason: retConfig.reason,
        createdAt: randomDate(),
        items: {
          create: [
            {
              orderItemId: itemToReturn.id,
              quantity: itemToReturn.quantity,
              reason: retConfig.reason
            }
          ]
        }
      }
    });

    log(`Created return request for order ${order.orderNumber} with status ${statusToUse}`);
  }

  log("Seed orders and returns complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
