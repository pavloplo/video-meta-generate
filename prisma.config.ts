import { defineConfig } from "prisma/config";

console.log('🔍 Prisma config loading...');
console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://fallback:fallback@localhost:5432/fallback",
  },
});
