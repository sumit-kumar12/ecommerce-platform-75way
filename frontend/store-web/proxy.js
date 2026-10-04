import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api/v1";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if we are running in production or if the environment explicitly demands HTTPS
  const isProd = process.env.NODE_ENV === "production";
  const forceHttps = process.env.FORCE_HTTPS === "true";
  
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const currentProto = request.nextUrl.protocol;
  const isHttp = (forwardedProto && forwardedProto !== "https") || currentProto === "http:";
  
  const hostname = request.headers.get("host") || "";
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

  // Force HTTPS in production globally, or if explicitly forced.
  // Cloudflare tunnel always delivers HTTPS, so this works correctly.
  if (isHttp && (isProd || forceHttps) && !isLocalhost) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }

  // When behind Cloudflare tunnel, use the internal backend directly for lockout check
  // (server-side fetch — stays internal, no CORS issues)
  const internalApiBase = process.env.INTERNAL_API_BASE || API_BASE_URL;

  try {
    const res = await fetch(`${internalApiBase}/monitoring/lockout-status`, {
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.locked) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  } catch (err) {
    console.error("Lockout check failed:", err);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
