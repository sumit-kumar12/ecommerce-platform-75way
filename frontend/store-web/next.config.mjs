import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const isDev = process.env.NEXT_PUBLIC_CSP_STRICT !== "true" && process.env.NODE_ENV !== "production";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Tunnel / Public URL Support
// Set TUNNEL_API_URL in .env.local when using cloudflared:
//   TUNNEL_API_URL=https://xyz-abc.trycloudflare.com
// This makes browser API calls go to the backend tunnel URL instead of localhost.
// ─────────────────────────────────────────────────────────────────────────────
const tunnelApiUrl = process.env.TUNNEL_API_URL?.replace(/\/$/, "") || null;
const tunnelStoreUrl = process.env.TUNNEL_STORE_URL?.replace(/\/$/, "") || null;

const getDevOriginUrls = (port) => {
  const origins = new Set([`http://localhost:${port}`, `http://127.0.0.1:${port}`]);

  if (!isDev) return Array.from(origins);

  const interfaces = os.networkInterfaces();
  for (const records of Object.values(interfaces)) {
    for (const record of records ?? []) {
      if (!record || record.family !== "IPv4" || record.internal) continue;
      origins.add(`http://${record.address}:${port}`);
    }
  }

  return Array.from(origins);
};

// CSP connect-src: include tunnel URL for browser API calls if tunneling
const buildConnectSrc = () => {
  const localOrigins = `http://localhost:3000 http://127.0.0.1:3000 http://localhost:4000 http://127.0.0.1:4000 ws://localhost:3000 ws://127.0.0.1:3000 wss://localhost:3000 wss://127.0.0.1:3000`;
  const tunnelOrigins = [
    tunnelApiUrl ? `${tunnelApiUrl}` : null,
    tunnelStoreUrl ? `${tunnelStoreUrl}` : null,
    tunnelApiUrl ? `${tunnelApiUrl.replace("https://", "wss://")}` : null,
  ].filter(Boolean).join(" ");

  if (!isDev) {
    const prodBase = "connect-src 'self' https://api.example.com https://*.razorpay.com";
    return tunnelApiUrl ? `${prodBase} ${tunnelApiUrl}` : prodBase;
  }
  return `connect-src 'self' ${localOrigins}${tunnelOrigins ? ` ${tunnelOrigins}` : ""} https://*.razorpay.com`;
};

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com"
  : "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com";

const connectSrc = buildConnectSrc();

const imageSrc = isDev
  ? `img-src 'self' data: https: ${getDevOriginUrls(4000).join(" ")}${tunnelApiUrl ? ` ${tunnelApiUrl}` : ""}`
  : "img-src 'self' data: https:";

const mediaSrc = isDev
  ? `media-src 'self' data: https: ${getDevOriginUrls(4000).join(" ")}${tunnelApiUrl ? ` ${tunnelApiUrl}` : ""}`
  : "media-src 'self' data: https:";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  imageSrc,
  mediaSrc,
  connectSrc,
  "font-src 'self' data: https://fonts.gstatic.com",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..", "..");

const getDevAllowedOrigins = () => {
  const origins = new Set([
    "localhost",
    "127.0.0.1",
    "gradually-future-delaware-coaching.trycloudflare.com",
    "entries-metallica-sin-venture.trycloudflare.com"
  ]);

  // Allow cloudflare tunnel hostnames for Next.js HMR/dev
  if (tunnelStoreUrl) {
    try {
      origins.add(new URL(tunnelStoreUrl).hostname);
    } catch {}
  }

  if (process.env.NODE_ENV === "production") {
    return Array.from(origins);
  }

  const interfaces = os.networkInterfaces();
  for (const records of Object.values(interfaces)) {
    for (const record of records ?? []) {
      if (!record || record.family !== "IPv4" || record.internal) continue;
      origins.add(record.address);
    }
  }

  return Array.from(origins);
};

// Image remote patterns: add tunnel API URL for media delivery
const buildImageRemotePatterns = () => {
  const patterns = [
    { protocol: "http", hostname: "localhost", port: "4000", pathname: "/**" },
    { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/**" },
    { protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" },
    { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/**" },
  ];

  // If a tunnel URL is set for the backend, also allow images from it
  if (tunnelApiUrl) {
    try {
      const hostname = new URL(tunnelApiUrl).hostname;
      patterns.push({ protocol: "https", hostname, pathname: "/**" });
    } catch {}
  }

  return patterns;
};

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared-ui"],
  turbopack: {
    root: workspaceRoot,
  },
  images: {
    unoptimized: isDev,
    remotePatterns: buildImageRemotePatterns(),
  },
  allowedDevOrigins: getDevAllowedOrigins(),
  // ──────────────────────────────────────────────
  // Rewrites: proxy /api-proxy/* → backend (server-side only)
  // This means browser calls /api-proxy/... → Next.js server → localhost:4000
  // The backend is NEVER directly exposed — only reachable via Next.js
  // ──────────────────────────────────────────────
  async rewrites() {
    const internalBackend = process.env.INTERNAL_API_BASE || "http://127.0.0.1:4000";
    return [
      {
        source: "/api-proxy/:path*",
        destination: `${internalBackend}/:path*`,
      },
      {
        source: "/media/products/:path*",
        destination: `${internalBackend}/media/products/:path*`,
      },
      {
        source: "/campaigns/:path*",
        destination: `${internalBackend}/campaigns/:path*`,
      },
      {
        source: "/sponsored-ads/:path*",
        destination: `${internalBackend}/sponsored-ads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
