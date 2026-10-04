import authRoutes from "./auth.routes.js";
import { Router } from "express";
import productRoutes from "./product.routes.js";
import cartRoutes from "./cart.routes.js";
import wishlistRoutes from "./wishlist.routes.js";
import orderRoutes from "./order.routes.js";
import paymentRoutes from "./payment.routes.js";
import paymentWebhookRoutes from "./payment-webhook.routes.js";
import monitoringRoutes from "./monitoring.routes.js";
import userRoutes from "./user.routes.js";
import offerRoutes from "./offer.routes.js";
import addressRoutes from "./address.routes.js";
import campaignRoutes from "./campaign.routes.js";
import flashDealRoutes from "./flash-deal.routes.js";
import sponsoredAdRoutes from "./sponsored-ad.routes.js";
import outletRoutes from "./outlet.routes.js";
import shippingRoutes from "./shipping.routes.js";
import returnRoutes from "./returns.routes.js";
import notificationRoutes from "./notification.routes.js";
import { adminReviewRoutes } from "./review.routes.js";
import posRoutes from "./pos.routes.js";
import { lockoutGuardMiddleware } from "../middlewares/lockout.middleware.js";

const router = Router();

// Publicly available auth and health checks
import clientErrorsRoutes from "./client-errors.routes.js";
import eventsRoutes from "./events.routes.js";
router.use("/auth", authRoutes);
router.use("/client-errors", clientErrorsRoutes);
router.use("/events", eventsRoutes);
router.use("/monitoring", monitoringRoutes);
router.use("/payments", paymentWebhookRoutes);

// Apply lockout guard to the rest of the store routes
router.use(lockoutGuardMiddleware);

router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/offers", offerRoutes);
router.use("/addresses", addressRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/flash-deals", flashDealRoutes);
router.use("/sponsored-ads", sponsoredAdRoutes);
router.use("/outlets", outletRoutes);
router.use("/shipping", shippingRoutes);
router.use("/returns", returnRoutes);
router.use("/admin-reviews", adminReviewRoutes);
router.use("/pos", posRoutes);

export default router;
