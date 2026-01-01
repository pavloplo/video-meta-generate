import { defineConfig } from "prisma/config";

// Database URL is defined in schema.prisma as env("DATABASE_URL")
// This allows Prisma to handle environment variable loading properly
export default defineConfig({
  schema: "prisma/schema.prisma",
});
