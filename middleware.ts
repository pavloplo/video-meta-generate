import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ROUTES } from "@/constants/navigation";

/**
 * Protected routes that require authentication.
 */
const protectedRoutes = [ROUTES.VIDEO_GENERATE];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for session cookie
  // Use env var with fallback to default "sid" (matches env.server.ts default)
  const cookieName = process.env.SESSION_COOKIE_NAME ?? "sid";
  const sessionId = request.cookies.get(cookieName)?.value;

  if (!sessionId) {
    // Redirect to auth page without any query parameters
    // Return URL will be handled client-side via sessionStorage
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.AUTH;
    return NextResponse.redirect(url);
  }

  // Session validation happens in the page component
  // Middleware just checks for cookie presence
  return NextResponse.next();
}

export const config = {
  matcher: ["/create-youtube-metainformation/:path*"],
};
