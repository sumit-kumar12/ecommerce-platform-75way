import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import winston from "winston";
import { env } from "./env.js";
import { getRequestContext } from "./request-context.js";

const logsDir = path.resolve(process.cwd(), "logs");
fs.mkdirSync(logsDir, { recursive: true });

const logChainState = new Map();

const getImmutableUrl = () => (env.LOG_IMMUTABLE_ENDPOINT ? new URL(env.LOG_IMMUTABLE_ENDPOINT) : null);

const contextualFormat = winston.format((info) => {
  if (info.message && typeof info.message === "object" && !Array.isArray(info.message)) {
    Object.assign(info, info.message);
    delete info.message;
  }

  const context = getRequestContext();
  info.requestId = info.requestId ?? context.requestId ?? "system";
  info.userId = info.userId ?? context.userId ?? null;
  info.ip = info.ip ?? context.ip ?? null;
  info.userAgent = info.userAgent ?? context.userAgent ?? null;
  info.severity = info.severity ?? String(info.level).toUpperCase();
  info.eventType = info.eventType ?? "application";
  info.details = info.details ?? {};
  info.logChannel = info.logChannel ?? "app";
  return info;
});

const tamperEvidentFormat = winston.format((info) => {
  const channel = info.logChannel ?? "app";
  const prevHash = logChainState.get(channel) ?? "GENESIS";
  const material = JSON.stringify({
    timestamp: info.timestamp,
    requestId: info.requestId,
    userId: info.userId,
    ip: info.ip,
    userAgent: info.userAgent,
    severity: info.severity,
    eventType: info.eventType,
    details: info.details,
    logChannel: channel,
    prevLogHash: prevHash,
  });

  const logHash = crypto.createHmac("sha256", env.LOG_SIGNING_SECRET).update(material).digest("hex");
  info.prevLogHash = prevHash;
  info.logHash = logHash;
  logChainState.set(channel, logHash);
  return info;
});

const createImmutableTransport = (channelName) => {
  const immutableUrl = getImmutableUrl();
  if (!immutableUrl || !env.LOG_IMMUTABLE_TOKEN) return null;
  return new winston.transports.Http({
    host: immutableUrl.hostname,
    port: Number(immutableUrl.port || (immutableUrl.protocol === "https:" ? 443 : 80)),
    path: `${immutableUrl.pathname}${immutableUrl.search}`,
    ssl: immutableUrl.protocol === "https:",
    level: "info",
    headers: {
      Authorization: `Bearer ${env.LOG_IMMUTABLE_TOKEN}`,
      "x-log-channel": channelName,
    },
  });
};

const createChannelLogger = (filename) => {
  const channelName = filename.replace(".log", "");
  const transports = [
    new winston.transports.File({
      filename: path.join(logsDir, filename),
      level: env.LOG_LEVEL,
    }),
  ];

  if (env.NODE_ENV !== "test" && env.LOG_IMMUTABLE_ENABLED) {
    const immutableTransport = createImmutableTransport(channelName);
    if (immutableTransport) transports.push(immutableTransport);
  }

  if (env.NODE_ENV !== "production") {
    transports.push(
      new winston.transports.Console({
        level: env.LOG_LEVEL,
      }),
    );
  }

  return winston.createLogger({
    level: env.LOG_LEVEL,
    defaultMeta: { logChannel: channelName },
    format: winston.format.combine(
      winston.format.timestamp(),
      contextualFormat(),
      tamperEvidentFormat(),
      winston.format.json(),
    ),
    transports,
  });
};

export const loggers = {
  app: createChannelLogger("app.log"),
  error: createChannelLogger("error.log"),
  security: createChannelLogger("security.log"),
  audit: createChannelLogger("audit.log"),
  payment: createChannelLogger("payment.log"),
  slowQuery: createChannelLogger("slow-queries.log"),
  notifications: createChannelLogger("notifications.log"),
};
