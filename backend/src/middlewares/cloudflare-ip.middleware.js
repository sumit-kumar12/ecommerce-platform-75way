// Pure Express middleware — no external imports needed

/**
 * Cloudflare IP validation middleware
 *
 * When your Express backend is behind a Cloudflare tunnel:
 * - req.ip = Cloudflare edge server IP (not the visitor's real IP)
 * - cf-connecting-ip = the real visitor IP set by Cloudflare
 *
 * This middleware:
 *   1. Reads the real IP from cf-connecting-ip (if present)
 *   2. Optionally validates the request comes from a known Cloudflare IP
 *
 * IMPORTANT: Only trust cf-connecting-ip when TRUST_PROXY=true and your server
 * is not directly internet-accessible (which it isn't when using cloudflared).
 */

// Cloudflare published IP ranges (updated June 2025)
// Source: https://www.cloudflare.com/ips/
const CLOUDFLARE_IPV4_RANGES = [
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "108.162.192.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "198.41.128.0/17",
  "162.158.0.0/15",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "172.64.0.0/13",
  "131.0.232.0/22",
];

/**
 * Convert CIDR to numeric range for comparison
 */
const cidrToRange = (cidr) => {
  const [ip, bits] = cidr.split("/");
  const mask = ~((1 << (32 - parseInt(bits))) - 1) >>> 0;
  const ipNum = ip.split(".").reduce((acc, octet) => (acc << 8) | parseInt(octet), 0) >>> 0;
  const start = (ipNum & mask) >>> 0;
  const end = (start | ~mask) >>> 0;
  return { start, end };
};

const CF_RANGES = CLOUDFLARE_IPV4_RANGES.map(cidrToRange);

/**
 * Check if an IPv4 address is in any Cloudflare range
 */
export const isCloudflareIp = (ip) => {
  if (!ip || ip.includes(":")) return false; // skip IPv6 (Cloudflare has separate IPv6)
  const stripped = ip.replace(/^::ffff:/, ""); // strip IPv4-mapped IPv6
  const parts = stripped.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) return false;
  const ipNum = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  return CF_RANGES.some(({ start, end }) => ipNum >= start && ipNum <= end);
};

/**
 * Extract real client IP from Cloudflare request headers.
 * Priority: cf-connecting-ip > x-real-ip > x-forwarded-for first entry > remoteAddress
 */
export const getRealClientIp = (req) => {
  const cfIp = req.headers["cf-connecting-ip"];
  if (cfIp) return String(cfIp).trim();
  const xRealIp = req.headers["x-real-ip"];
  if (xRealIp) return String(xRealIp).trim();
  const xForwardedFor = req.headers["x-forwarded-for"];
  if (xForwardedFor) return String(xForwardedFor).split(",")[0].trim();
  return req.ip || req.socket?.remoteAddress || "unknown";
};

/**
 * Express middleware: override req.ip with real Cloudflare visitor IP.
 * Register this as the FIRST middleware in app.js.
 *
 * Usage in app.js:
 *   import { cloudflareRealIpMiddleware } from './middlewares/cloudflare-ip.middleware.js';
 *   app.use(cloudflareRealIpMiddleware);
 */
export const cloudflareRealIpMiddleware = (req, _res, next) => {
  const realIp = getRealClientIp(req);

  // Overwrite req.ip so all downstream middleware (rate limiter, threat scorer, etc.)
  // use the real visitor IP and not the Cloudflare edge IP.
  Object.defineProperty(req, "ip", {
    configurable: true,
    get() {
      return realIp;
    },
  });

  // Also expose it as a dedicated property for clarity
  req.realIp = realIp;
  req.cfCountry = req.headers["cf-ipcountry"] || null;
  req.cfRayId = req.headers["cf-ray"] || null;
  req.isTunneledRequest = Boolean(req.headers["cf-connecting-ip"]);

  next();
};
