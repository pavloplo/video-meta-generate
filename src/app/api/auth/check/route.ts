import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth.server";

/**
 * Simple endpoint to check if user is authenticated.
 * Returns 200 if authenticated, 401 if not.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
