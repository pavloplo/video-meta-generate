import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protected routes that require authentication.
 */
const protectedRoutes = ["/create-youtube-metainformation"];

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
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.searchParams.set(
      "returnTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`
    );
    return NextResponse.redirect(url);
  }

  // Session validation happens in the page component
  // Middleware just checks for cookie presence
  return NextResponse.next();
}

export const config = {
  matcher: ["/create-youtube-metainformation/:path*"],
};
