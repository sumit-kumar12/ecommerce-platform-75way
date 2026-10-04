import cron from "node-cron";
import { loggers } from "../config/logger.js";
import { releaseExpiredReservations } from "../services/order.service.js";
// import { scheduleFlashDealActivation } from "../services/flash-deal.service.js";

export const startCronJobs = () => {
  loggers.app.info({ eventType: "cron_jobs_started" });

  // Run every 15 minutes
  cron.schedule("*/15 * * * *", async () => {
    try {
      const count = await releaseExpiredReservations();
      if (count > 0) {
        loggers.app.info({
          eventType: "stock_reservations_released",
          details: { count },
        });
      }
    } catch (err) {
      loggers.app.error({
        eventType: "stock_release_job_failed",
        details: { message: err.message },
      });
    }
  });

  // Add any flash deal schedules here if needed
};
