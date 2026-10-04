import { PrismaClient } from "@prisma/client";
import { loggers } from "./logger.js";
import { matchPatterns, SQL_INJECTION_PATTERNS } from "../utils/security-patterns.js";

const basePrisma = new PrismaClient();

export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const start = process.hrtime.bigint();

        if (matchPatterns(args, SQL_INJECTION_PATTERNS)) {
          loggers.security.warn({
            eventType: "suspicious_query_pattern",
            details: {
              model,
              action: operation,
            },
          });
        }

        try {
          const result = await query(args);
          const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
          if (elapsedMs > 1000) {
            loggers.slowQuery.error({
              severity: "CRITICAL",
              eventType: "slow_query_critical",
              details: {
                model,
                action: operation,
                elapsedMs,
              },
            });
          } else if (elapsedMs > 200) {
            loggers.slowQuery.warn({
              severity: "WARN",
              eventType: "slow_query_warning",
              details: {
                model,
                action: operation,
                elapsedMs,
              },
            });
          }
          return result;
        } catch (error) {
          loggers.error.error({
            eventType: "database_error",
            details: {
              model,
              action: operation,
              message: error.message,
            },
          });
          throw error;
        }
      },
    },
  },
});
