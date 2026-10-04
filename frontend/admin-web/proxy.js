import { NextResponse } from "next/server";

export function proxy(request) {
  const path = request.nextUrl.pathname;
  
  // Skip static files, API routes, and Next.js internal paths
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1. Check if we are running in production or if the environment explicitly demands HTTPS
  const isProd = process.env.NODE_ENV === "production";
  const forceHttps = process.env.FORCE_HTTPS === "true";
  
  // Identify the protocol
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const currentProto = request.nextUrl.protocol;
  const isHttp = (forwardedProto && forwardedProto !== "https") || currentProto === "http:";
  
  const hostname = request.headers.get("host") || "";
  const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");

  // Force HTTPS for Admin panel. If running locally, we only enforce if FORCE_HTTPS=true
  if (isHttp && (isProd || forceHttps) && !isLocalhost) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308); // 308 Permanent Redirect
  }

  if (isHttp && isLocalhost && forceHttps) {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl, 308);
  }

  // 2. Auth checks
  const isPublicPath = path === '/login';
  const token = request.cookies.get('accessToken') || request.cookies.get('refreshToken');

  if (!isPublicPath && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logo.png).*)',
  ],
};
