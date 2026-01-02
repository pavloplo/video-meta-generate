import "server-only";
import { PrismaClient } from "@prisma/client";
import { env } from "@/lib/env.server";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Use validated env to ensure DATABASE_URL is available
// This will throw a clear error if DATABASE_URL is missing
const databaseUrl = env.DATABASE_URL;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["error", "warn"], // enable if useful
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
