import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const isDev = process.env.NEXT_PUBLIC_CSP_STRICT !== "true" && process.env.NODE_ENV !== "production";

// ─────────────────────────────────────────────────────────────────────────────
// Cloudflare Tunnel / Public URL Support
// Set TUNNEL_API_URL in .env.local when using cloudflared:
//   TUNNEL_API_URL=https://xyz-abc.trycloudflare.com
// ─────────────────────────────────────────────────────────────────────────────
const tunnelApiUrl = process.env.TUNNEL_API_URL?.replace(/\/$/, "") || null;
const tunnelAdminUrl = process.env.TUNNEL_ADMIN_URL?.replace(/\/$/, "") || null;

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

const buildConnectSrc = () => {
  const localOrigins = `http://localhost:3001 http://127.0.0.1:3001 http://localhost:4000 http://127.0.0.1:4000 ws://localhost:3001 ws://127.0.0.1:3001 wss://localhost:3001 wss://127.0.0.1:3001`;
  const tunnelOrigins = [
    tunnelApiUrl ? `${tunnelApiUrl}` : null,
    tunnelAdminUrl ? `${tunnelAdminUrl}` : null,
    tunnelAdminUrl ? `${tunnelAdminUrl.replace("https://", "wss://")}` : null,
  ].filter(Boolean).join(" ");

  if (!isDev) {
    const prodBase = "connect-src 'self' https://admin-api.example.com";
    return tunnelApiUrl ? `${prodBase} ${tunnelApiUrl}` : prodBase;
  }
  return `connect-src 'self' ${localOrigins}${tunnelOrigins ? ` ${tunnelOrigins}` : ""}`;
};

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
  : "script-src 'self' 'unsafe-inline'";

const connectSrc = buildConnectSrc();

const imageSrc = isDev
  ? `img-src 'self' data: https: ${getDevOriginUrls(4000).join(" ")}${tunnelApiUrl ? ` ${tunnelApiUrl}` : ""}`
  : "img-src 'self' data: https:";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  imageSrc,
  connectSrc,
  "font-src 'self' https://fonts.gstatic.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..", "..");

const getDevAllowedOrigins = () => {
  const origins = new Set([
    "localhost",
    "127.0.0.1",
    "delaware-humans-portfolio-visited.trycloudflare.com",
    "properties-terrorists-kim-upper.trycloudflare.com"
  ]);

  // Allow cloudflare tunnel hostnames for Next.js HMR/dev
  if (tunnelAdminUrl) {
    try {
      origins.add(new URL(tunnelAdminUrl).hostname);
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

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["shared-ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
  turbopack: {
    root: workspaceRoot,
  },
  allowedDevOrigins: getDevAllowedOrigins(),
  // ──────────────────────────────────────────────
  // Rewrites: proxy /api-proxy/* → backend (server-side only)
  // Backend is never directly internet-accessible
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
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
