#!/usr/bin/env node

// Simple migration script - ensures DATABASE_URL is set and runs Prisma
// Environment variables should be set by the caller (GitHub Actions, local .env, etc.)

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to load .env files if they exist (for local development)
const loadEnvIfExists = (filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`📝 Loading environment from ${filePath}`);
    require('dotenv').config({ path: fullPath });
  }
};

loadEnvIfExists('.env.local');
loadEnvIfExists('.env');

// Get database URL (DIRECT_URL for migrations, fallback to DATABASE_URL)
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL or DIRECT_URL must be set');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('DIRECT')).join(', ') || 'none');
  process.exit(1);
}

console.log('✅ Database URL found');

// Ensure both DATABASE_URL and DIRECT_URL are set for Prisma
process.env.DATABASE_URL = databaseUrl;
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = databaseUrl;
}

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
