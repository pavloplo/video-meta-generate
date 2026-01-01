import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file if it exists
// Try multiple locations
dotenv.config({ path: path.join(process.cwd(), ".env") });
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

// Prisma migrate deploy uses DIRECT_URL for direct database connections
// DATABASE_URL is used by Prisma Client for connection pooling
// For Supabase: DIRECT_URL bypasses PgBouncer, DATABASE_URL uses it
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("ERROR: DATABASE_URL or DIRECT_URL must be set");
  console.error("Current working directory:", process.cwd());
  console.error(
    "Available env vars:",
    Object.keys(process.env).filter((k) => k.includes("DATABASE"))
  );
  console.error(
    "DIRECT_URL:",
    process.env.DIRECT_URL
      ? `set (length: ${process.env.DIRECT_URL.length})`
      : "not set"
  );
  console.error(
    "DATABASE_URL:",
    process.env.DATABASE_URL
      ? `set (length: ${process.env.DATABASE_URL.length})`
      : "not set"
  );
  throw new Error("DATABASE_URL or DIRECT_URL must be set");
}

console.log(
  "✅ Prisma config loaded with database URL (length:",
  databaseUrl.length + ")"
);
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
