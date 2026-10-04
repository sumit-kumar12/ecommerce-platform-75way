import app from "./app.js";
import { env } from "./config/env.js";
import { loggers } from "./config/logger.js";
import { prisma } from "./config/prisma.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { attachThreatWs } from "./threat-ws.js";
import { ensureThreatRuleDefaults } from "./services/threat-policy.service.js";
import { ensureAdminControlDefaults } from "./services/admin-control.service.js";
import { configureSearchEngine } from "./services/search-engine.service.js";

const start = async () => {
  try {
    await prisma.$connect();
    await ensureThreatRuleDefaults();
    await ensureAdminControlDefaults();
    await connectRedis();
    await configureSearchEngine();
    loggers.app.info({
      eventType: "startup_dependencies_connected",
      details: {},
    });
  } catch (error) {
    loggers.error.error({
      severity: "CRITICAL",
      eventType: "startup_dependency_connection_failed",
      details: { message: error.message },
    });
    process.exit(1);
  }

  const server = app.listen(env.PORT, "0.0.0.0", () => {
    attachThreatWs(server);
    loggers.app.info({
      eventType: "server_started",
      details: {
        port: env.PORT,
        nodeEnv: env.NODE_ENV,
      },
    });

    // Start background jobs
    import("./workers/cron.js").then(({ startCronJobs }) => {
      startCronJobs();
    }).catch(console.error);
  });

  const shutdown = async (signal) => {
    loggers.app.warn({
      eventType: "shutdown_signal_received",
      details: { signal },
    });
    server.close(async () => {
      await disconnectRedis();
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  process.on("unhandledRejection", (reason) => {
    loggers.error.error({
      severity: "CRITICAL",
      eventType: "unhandled_rejection",
      details: { message: reason instanceof Error ? reason.message : String(reason), stack: reason instanceof Error ? reason.stack : undefined },
    });
    shutdown("unhandledRejection");
  });

  process.on("uncaughtException", (error) => {
    loggers.error.error({
      severity: "CRITICAL",
      eventType: "uncaught_exception",
      details: { message: error.message, stack: error.stack },
    });
    shutdown("uncaughtException");
  });
};

start();
