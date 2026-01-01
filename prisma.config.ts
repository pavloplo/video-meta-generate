import { defineConfig, env } from "prisma/config";

// Prisma's env() helper reads DATABASE_URL from environment variables
// The migration script ensures this is set to the direct connection URL
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
