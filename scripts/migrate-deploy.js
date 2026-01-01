#!/usr/bin/env node

// Migration deployment script that ensures environment variables are loaded
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { execSync } = require('child_process');

// Verify environment variables
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ ERROR: DATABASE_URL or DIRECT_URL must be set');
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
  process.exit(1);
}

console.log('✅ Database URL found (length:', databaseUrl.length + ')');
console.log('✅ Using:', databaseUrl === process.env.DIRECT_URL ? 'DIRECT_URL' : 'DATABASE_URL');

// Verify Supabase connection string format
const urlPattern = /postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+/;
if (!urlPattern.test(databaseUrl)) {
  console.warn('⚠️  Warning: Database URL format may be incorrect');
  console.warn('Expected format: postgresql://user:password@host:port/database');
}

// Extract connection details for verification (masked)
try {
  const urlMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (urlMatch) {
    const [, user, , host, port, database] = urlMatch;
    console.log('🔍 Connection details:');
    console.log('  Host:', host);
    console.log('  Port:', port);
    console.log('  Database:', database);
    console.log('  User:', user);
    console.log('  Password:', '***');
  }
} catch (e) {
  // Ignore parsing errors
}

// Set environment variables explicitly for Prisma
process.env.DATABASE_URL = databaseUrl;
if (process.env.DIRECT_URL) {
  process.env.DIRECT_URL = process.env.DIRECT_URL;
} else {
  process.env.DIRECT_URL = databaseUrl;
}

// Run Prisma migrate deploy with explicit environment
try {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  });
} catch (error) {
  console.error('❌ Migration failed');
  console.error('Verify your Supabase connection strings:');
  console.error('  - DIRECT_URL should use port 5432 (direct connection)');
  console.error('  - DATABASE_URL can use port 6543 (PgBouncer) or 5432');
  process.exit(1);
}
