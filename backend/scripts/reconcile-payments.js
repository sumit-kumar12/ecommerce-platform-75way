import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const args = new Set(process.argv.slice(2));
const dryRun = !args.has("--apply");
const staleMinutesArg = process.argv.find((arg) => arg.startsWith("--stale-minutes="));
const staleMinutes = Math.max(5, Number(staleMinutesArg?.split("=")[1] ?? 30));
const staleBefore = new Date(Date.now() - staleMinutes * 60 * 1000);

const toPaise = (value) => Math.round(Number(value || 0) * 100);

const releaseCancelledOrderReservations = async ({ tx, orderId }) => {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      payments: true,
      offerRedemptions: true,
    },
  });
  if (!order || order.status !== "PENDING_PAYMENT" || order.paymentStatus !== "PENDING") {
    return { released: false, reason: "order_not_pending" };
  }
  if (order.payments.some((payment) => payment.status === "VERIFIED" || payment.status === "PENDING")) {
    return { released: false, reason: "active_or_verified_payment_exists" };
  }

  for (const item of order.items) {
    await tx.productVariant.update({
      where: { id: item.variantId },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });
  }

  for (const redemption of order.offerRedemptions) {
    await tx.offer.update({
      where: { id: redemption.offerId },
      data: {
        redeemedCount: {
          decrement: redemption.quantity,
        },
      },
    });
  }

  await tx.offerRedemption.deleteMany({ where: { orderId } });
  await tx.order.update({
    where: { id: orderId },
    data: {
      status: "CANCELLED",
      paymentStatus: "FAILED",
      notes: order.notes
        ? `${order.notes}\nCancelled by payment reconciliation; inventory and offer reservations released.`
        : "Cancelled by payment reconciliation; inventory and offer reservations released.",
    },
  });

  return {
    released: true,
    restoredItems: order.items.length,
    restoredOffers: order.offerRedemptions.length,
  };
};

const main = async () => {
  const [stalePendingPayments, verifiedPaymentOrderMismatches, paidOrderPaymentMismatches, failedPayments] =
    await Promise.all([
      prisma.payment.findMany({
        where: {
          status: "PENDING",
          createdAt: { lt: staleBefore },
        },
        include: { order: true },
        orderBy: { createdAt: "asc" },
      }),
      prisma.payment.findMany({
        where: {
          status: "VERIFIED",
          order: {
            paymentStatus: { not: "VERIFIED" },
          },
        },
        include: { order: true },
      }),
      prisma.order.findMany({
        where: {
          paymentMethod: "ONLINE",
          paymentStatus: "VERIFIED",
          payments: {
            none: { status: "VERIFIED" },
          },
        },
        include: { payments: true },
      }),
      prisma.payment.findMany({
        where: {
          status: "FAILED",
          updatedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
        include: { order: true },
        orderBy: { updatedAt: "desc" },
        take: 50,
      }),
    ]);

  const amountMismatches = [];
  for (const payment of await prisma.payment.findMany({ include: { order: { include: { items: true } } } })) {
    const recalculated = payment.order.items.reduce((sum, item) => sum + toPaise(item.lineTotal), 0);
    if (payment.expectedAmount !== recalculated) {
      amountMismatches.push({
        paymentId: payment.id,
        orderId: payment.orderId,
        providerOrderId: payment.providerOrderId,
        expectedAmount: payment.expectedAmount,
        recalculatedAmount: recalculated,
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    dryRun,
    staleMinutes,
    stalePendingPayments: stalePendingPayments.map((payment) => ({
      paymentId: payment.id,
      orderId: payment.orderId,
      providerOrderId: payment.providerOrderId,
      createdAt: payment.createdAt,
      orderStatus: payment.order.status,
      orderPaymentStatus: payment.order.paymentStatus,
    })),
    verifiedPaymentOrderMismatches: verifiedPaymentOrderMismatches.map((payment) => ({
      paymentId: payment.id,
      orderId: payment.orderId,
      providerOrderId: payment.providerOrderId,
      orderStatus: payment.order.status,
      orderPaymentStatus: payment.order.paymentStatus,
    })),
    paidOrderPaymentMismatches: paidOrderPaymentMismatches.map((order) => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      paymentCount: order.payments.length,
    })),
    amountMismatches,
    failedPaymentsLast24h: failedPayments.map((payment) => ({
      paymentId: payment.id,
      orderId: payment.orderId,
      providerOrderId: payment.providerOrderId,
      failureReason: payment.failureReason,
      updatedAt: payment.updatedAt,
    })),
  };

  if (!dryRun && stalePendingPayments.length) {
    const orderIds = [...new Set(stalePendingPayments.map((payment) => payment.orderId))];
    const releaseResults = await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: {
          id: { in: stalePendingPayments.map((payment) => payment.id) },
        },
        data: {
          status: "FAILED",
          failureReason: `Marked failed by reconciliation after ${staleMinutes} minutes pending.`,
        },
      });

      const results = [];
      for (const orderId of orderIds) {
        results.push({
          orderId,
          ...(await releaseCancelledOrderReservations({ tx, orderId })),
        });
      }
      return results;
    });
    report.applied = {
      stalePaymentsMarkedFailed: stalePendingPayments.length,
      ordersEvaluatedForRelease: orderIds.length,
      releasedOrders: releaseResults.filter((result) => result.released).length,
      releaseResults,
    };
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

  const hasCriticalMismatch =
    verifiedPaymentOrderMismatches.length > 0 || paidOrderPaymentMismatches.length > 0 || amountMismatches.length > 0;
  if (hasCriticalMismatch) process.exitCode = 2;
};

main()
  .catch((error) => {
    process.stderr.write(`[payment-reconcile] failed: ${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
