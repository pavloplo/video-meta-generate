import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env.server";

/**
 * Server-only auth utilities.
 * Checks for valid session from cookie.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(env.SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true }
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  return session;
}

/**
 * Check if user is authenticated.
 * Returns user if authenticated, null otherwise.
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

