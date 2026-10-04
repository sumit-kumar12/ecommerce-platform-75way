import Redis from "ioredis";
import { env } from "./env.js";
import { loggers } from "./logger.js";

class InMemoryRedis {
  constructor() {
    this.store = new Map();
    this.status = "ready";
  }

  _purgeExpired(key) {
    const entry = this.store.get(key);
    if (!entry) return;
    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
    }
  }

  _getEntry(key) {
    this._purgeExpired(key);
    return this.store.get(key);
  }

  async connect() {
    this.status = "ready";
  }

  async quit() {
    this.status = "end";
  }

  async ping() {
    return "PONG";
  }

  async get(key) {
    const entry = this._getEntry(key);
    return entry ? String(entry.value) : null;
  }

  async set(key, value, ...args) {
    let expiresAt = null;
    if (args.length >= 2 && String(args[0]).toUpperCase() === "EX") {
      expiresAt = Date.now() + Number(args[1]) * 1000;
    }
    this.store.set(key, { value: String(value), expiresAt });
    return "OK";
  }

  async incr(key) {
    const entry = this._getEntry(key);
    const next = entry ? Number(entry.value) + 1 : 1;
    this.store.set(key, { value: String(next), expiresAt: entry?.expiresAt ?? null });
    return next;
  }

  async del(...keys) {
    let deleted = 0;
    for (const key of keys) {
      if (this.store.delete(key)) deleted += 1;
    }
    return deleted;
  }

  async expire(key, seconds) {
    const entry = this._getEntry(key);
    if (!entry) return 0;
    entry.expiresAt = Date.now() + Number(seconds) * 1000;
    this.store.set(key, entry);
    return 1;
  }

  async ttl(key) {
    const entry = this._getEntry(key);
    if (!entry) return -2;
    if (!entry.expiresAt) return -1;
    return Math.max(0, Math.floor((entry.expiresAt - Date.now()) / 1000));
  }

  async call(command, ...args) {
    const op = String(command).toUpperCase();
    if (op === "GET") return this.get(args[0]);
    if (op === "SET") return this.set(args[0], args[1], ...args.slice(2));
    if (op === "INCR") return this.incr(args[0]);
    if (op === "DEL") return this.del(...args);
    if (op === "EXPIRE") return this.expire(args[0], args[1]);
    if (op === "TTL") return this.ttl(args[0]);
    throw new Error(`Unsupported in-memory redis command: ${command}`);
  }

  async setex(key, seconds, value) {
    return this.set(key, value, "EX", seconds);
  }

  async mget(...keys) {
    const results = await Promise.all(keys.map((k) => this.get(k)));
    return results;
  }

  pipeline() {
    const ops = [];
    const self = this;
    const pipe = {
      get(key) { ops.push(() => self.get(key)); return pipe; },
      set(key, value, ...args) { ops.push(() => self.set(key, value, ...args)); return pipe; },
      setex(key, seconds, value) { ops.push(() => self.setex(key, seconds, value)); return pipe; },
      del(...keys) { ops.push(() => self.del(...keys)); return pipe; },
      incr(key) { ops.push(() => self.incr(key)); return pipe; },
      expire(key, seconds) { ops.push(() => self.expire(key, seconds)); return pipe; },
      async exec() {
        const results = [];
        for (const op of ops) {
          try {
            const result = await op();
            results.push([null, result]);
          } catch (err) {
            results.push([err, null]);
          }
        }
        return results;
      },
    };
    return pipe;
  }

  on() { }
}

const createRedisClient = () => {
  if (env.NODE_ENV === "development" || env.REDIS_URL.startsWith("memory://")) {
    return new InMemoryRedis();
  }

  return new Redis(env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    keyPrefix: `${env.REDIS_KEY_PREFIX}:`,
    retryStrategy: (times) => Math.min(times * 250, 1500),
    tls: env.REDIS_TLS ? {} : undefined,
  });
};

const bindRedisLogging = (client) => {
  client.on?.("error", (error) => {
    loggers.error.error({
      eventType: "redis_error",
      details: { message: error.message },
    });
  });

  client.on?.("ready", () => {
    loggers.app.info({
      eventType: "redis_ready",
      details: {},
    });
  });
};

export let redis = createRedisClient();

bindRedisLogging(redis);

export const connectRedis = async () => {
  if (redis.status === "ready" || redis.status === "connecting") return;

  let lastError = null;
  const attempts = env.NODE_ENV === "development" ? 8 : 3;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      if (redis.status !== "ready" && redis.status !== "connecting") {
        await redis.connect();
      }
      return;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 300));
    }
  }

  if (env.NODE_ENV === "development") {
    loggers.app.warn({
      eventType: "redis_fallback_to_memory",
      details: { message: lastError?.message ?? "Redis unavailable in development." },
    });
    try {
      await redis.quit?.();
    } catch {
      // ignore close errors during fallback
    }
    redis = new InMemoryRedis();
    bindRedisLogging(redis);
    await redis.connect();
    return;
  }

  throw lastError;
};

export const disconnectRedis = async () => {
  if (redis.status === "end" || redis.status === "close") return;
  try { await redis.quit(); } catch { /* already closed */ }
};

export const pingRedis = async () => {
  const pong = await redis.ping();
  return pong === "PONG";
};
