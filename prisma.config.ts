// IMPORTANT: Load dotenv BEFORE importing anything else
// This ensures environment variables are available when Prisma evaluates the config
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// In Prisma 7, datasource URL must be in prisma.config.ts, not schema.prisma
// The env() helper will read from process.env (loaded by dotenv above)
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
