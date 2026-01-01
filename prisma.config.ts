import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load environment variables from .env file if it exists
// Try multiple locations
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const envLocalPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}

// Prisma migrate deploy uses DIRECT_URL for direct database connections
// DATABASE_URL is used by Prisma Client for connection pooling
// For Supabase: DIRECT_URL bypasses PgBouncer, DATABASE_URL uses it
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

// Debug logging
console.log("🔍 Prisma config evaluation:");
console.log("  Current directory:", process.cwd());
console.log("  .env file exists:", fs.existsSync(envPath));
console.log(
  "  DIRECT_URL:",
  process.env.DIRECT_URL
    ? `set (${process.env.DIRECT_URL.length} chars)`
    : "NOT SET"
);
console.log(
  "  DATABASE_URL:",
  process.env.DATABASE_URL
    ? `set (${process.env.DATABASE_URL.length} chars)`
    : "NOT SET"
);

if (!databaseUrl) {
  console.error("❌ ERROR: DATABASE_URL or DIRECT_URL must be set");
  console.error(
    "Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("DATABASE"))
  );
  throw new Error("DATABASE_URL or DIRECT_URL must be set");
}

console.log("✅ Prisma config loaded with database URL");
console.log(
  "✅ Using:",
  databaseUrl === process.env.DIRECT_URL ? "DIRECT_URL" : "DATABASE_URL"
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
