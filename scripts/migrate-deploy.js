#!/usr/bin/env node

// Migration script that ensures the correct DATABASE_URL is set for migrations
// For migrations, we need the DIRECT connection (bypasses PgBouncer)
const { execSync } = require('child_process');

// Get the direct database URL (DIRECT_URL is for migrations, DATABASE_URL is for app)
const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!directUrl) {
  console.error('❌ ERROR: DATABASE_URL or DIRECT_URL must be set');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DIRECT')).join(', ') || 'none');
  process.exit(1);
}

console.log('✅ Database URL is set');

// For migrations, always use DIRECT_URL and set DATABASE_URL to it
// This ensures prisma.config.ts can read it with env("DATABASE_URL")
process.env.DATABASE_URL = directUrl;
process.env.DIRECT_URL = directUrl;

console.log('🔧 Environment configured for migrations');

// Run Prisma migrate deploy
try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Migrations completed successfully');
} catch (error) {
  console.error('❌ Migration failed');
  process.exit(1);
}
