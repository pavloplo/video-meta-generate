#!/usr/bin/env node

/**
 * Script to verify Supabase connection strings are properly formatted
 * Run with: node scripts/verify-supabase.js
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;

console.log('🔍 Verifying Supabase Connection Strings\n');

// Check if variables are set
if (!databaseUrl && !directUrl) {
  console.error('❌ ERROR: Neither DATABASE_URL nor DIRECT_URL is set');
  console.error('\nSet them in .env.local:');
  console.error('DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"');
  console.error('DIRECT_URL="postgresql://user:password@host:port/database"');
  process.exit(1);
}

// Verify DATABASE_URL
if (databaseUrl) {
  console.log('✅ DATABASE_URL is set');
  console.log('   Length:', databaseUrl.length);
  
  const dbMatch = databaseUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);
  if (dbMatch) {
    const [, user, password, host, port, database, params] = dbMatch;
    console.log('   Host:', host);
    console.log('   Port:', port);
    console.log('   Database:', database);
    console.log('   User:', user);
    console.log('   Has PgBouncer:', params?.includes('pgbouncer=true') ? 'Yes (port 6543)' : 'No');
    
    if (port === '6543' && !params?.includes('pgbouncer=true')) {
      console.warn('   ⚠️  Port 6543 detected but pgbouncer=true not in URL');
    }
  } else {
    console.error('   ❌ Invalid format');
  }
} else {
  console.warn('⚠️  DATABASE_URL is not set');
}

console.log('');

// Verify DIRECT_URL
if (directUrl) {
  console.log('✅ DIRECT_URL is set');
  console.log('   Length:', directUrl.length);
  
  const directMatch = directUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);
  if (directMatch) {
    const [, user, password, host, port, database, params] = directMatch;
    console.log('   Host:', host);
    console.log('   Port:', port);
    console.log('   Database:', database);
    console.log('   User:', user);
    
    if (port !== '5432') {
      console.warn('   ⚠️  DIRECT_URL should use port 5432 for direct connection');
    }
    if (params?.includes('pgbouncer=true')) {
      console.warn('   ⚠️  DIRECT_URL should NOT use pgbouncer=true');
    }
  } else {
    console.error('   ❌ Invalid format');
  }
} else {
  console.warn('⚠️  DIRECT_URL is not set');
}

console.log('\n📋 Supabase Connection String Format:');
console.log('\nFor DATABASE_URL (with PgBouncer - connection pooling):');
console.log('  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true');
console.log('\nFor DIRECT_URL (direct connection - for migrations):');
console.log('  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres');
console.log('\nOr use the transaction mode connection:');
console.log('  postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&pgbouncer_mode=transaction');

