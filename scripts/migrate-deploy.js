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

// Show masked connection string for debugging (first 30 chars + last 20 chars)
const maskedUrl = databaseUrl.length > 50 
  ? databaseUrl.substring(0, 30) + '...' + databaseUrl.substring(databaseUrl.length - 20)
  : databaseUrl.substring(0, 20) + '***';
console.log('🔍 Connection string (masked):', maskedUrl);

// Verify Supabase connection string format
const urlPattern = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/[^?]+/;
if (!urlPattern.test(databaseUrl)) {
  console.error('❌ ERROR: Database URL format is incorrect');
  console.error('Expected format: postgresql://user:password@host:port/database');
  console.error('Received:', databaseUrl.substring(0, 50) + '...');
  process.exit(1);
}

// Extract connection details for verification (masked)
try {
  const urlMatch = databaseUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?$/);
  if (urlMatch) {
    const [, user, password, host, port, database, params] = urlMatch;
    console.log('🔍 Connection details:');
    console.log('  Host:', host);
    console.log('  Port:', port);
    console.log('  Database:', database);
    console.log('  User:', user);
    console.log('  Password length:', password.length);
    console.log('  Has params:', !!params);
    
    // Validate Supabase-specific requirements
    if (!host.includes('supabase.com') && !host.includes('pooler.supabase.com')) {
      console.warn('⚠️  Warning: Host does not appear to be a Supabase host');
      console.warn('  Expected: *.pooler.supabase.com or *.supabase.co');
      console.warn('  Got:', host);
    }
    
    if (port === '5432' && params?.includes('pgbouncer=true')) {
      console.warn('⚠️  Warning: Port 5432 should not use pgbouncer=true');
    }
    
    if (port === '6543' && !params?.includes('pgbouncer=true')) {
      console.warn('⚠️  Warning: Port 6543 typically requires pgbouncer=true');
    }
  } else {
    console.error('❌ ERROR: Could not parse database URL');
    console.error('URL format:', databaseUrl.substring(0, 100));
    process.exit(1);
  }
} catch (e) {
  console.error('❌ ERROR: Failed to parse connection string:', e.message);
  process.exit(1);
}

// Set environment variables explicitly for Prisma
// Use DIRECT_URL for migrations (bypasses PgBouncer)
process.env.DATABASE_URL = databaseUrl;
process.env.DIRECT_URL = process.env.DIRECT_URL || databaseUrl;

// Verify environment variables are set
console.log('🔍 Verifying environment variables before Prisma:');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? `set (${process.env.DATABASE_URL.length} chars)` : 'NOT SET');
console.log('  DIRECT_URL:', process.env.DIRECT_URL ? `set (${process.env.DIRECT_URL.length} chars)` : 'NOT SET');

// Temporarily backup and replace prisma.config.ts to ensure it has the URL
const fs = require('fs');
const path = require('path');
const configPath = path.join(process.cwd(), 'prisma.config.ts');
const backupPath = path.join(process.cwd(), 'prisma.config.ts.backup');

try {
  // Backup original config
  if (fs.existsSync(configPath)) {
    fs.copyFileSync(configPath, backupPath);
  }

  // Validate connection string has proper format before writing
  if (!databaseUrl.includes('@')) {
    console.error('❌ ERROR: Connection string is missing @ separator');
    console.error('Expected: postgresql://user:password@host:port/database');
    console.error('Got:', databaseUrl.substring(0, 100));
    throw new Error('Invalid connection string format');
  }

  // Create a new config file that definitely has the URL
  // Use JSON.stringify to properly escape the string
  const escapedUrl = JSON.stringify(databaseUrl);
  
  const newConfig = `import { defineConfig } from "prisma/config";

// Database URL is set via environment variable or fallback to direct value
// IMPORTANT: Environment variables take precedence over the fallback
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL || ${escapedUrl};

if (!databaseUrl) {
  throw new Error("DATABASE_URL or DIRECT_URL must be set");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
});
`;
  
  console.log('🔍 Config file will use URL (first 50 chars):', databaseUrl.substring(0, 50) + '...');
  
  fs.writeFileSync(configPath, newConfig);
  console.log('✅ Updated Prisma config with database URL');

  // Run Prisma migrate deploy with explicit environment
  const env = {
    ...process.env,
    DATABASE_URL: databaseUrl,
    DIRECT_URL: process.env.DIRECT_URL || databaseUrl,
  };

  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma', {
    stdio: 'inherit',
    env: env,
    cwd: process.cwd(),
  });

  // Restore original config
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
    console.log('✅ Restored original Prisma config');
  }
} catch (error) {
  // Restore original config on error
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, configPath);
    fs.unlinkSync(backupPath);
  }
  console.error('❌ Migration failed');
  console.error('Verify your Supabase connection strings:');
  console.error('  - DIRECT_URL should use port 5432 (direct connection)');
  console.error('  - DATABASE_URL can use port 6543 (PgBouncer) or 5432');
  console.error('\nDebug info:');
  console.error('  Current directory:', process.cwd());
  console.error('  DATABASE_URL value:', process.env.DATABASE_URL ? 'set' : 'not set');
  process.exit(1);
}
