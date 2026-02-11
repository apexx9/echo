#!/bin/bash

# Echo Migration Script for Render Database
# Run this script to complete database setup on Render

set -e

echo "🚀 Running Echo database migration on Render..."

# Check if DATABASE_URL is set

echo "📦 Installing dependencies..."
pnpm install

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo "🏗️  Running database migration..."
npx prisma db push

echo "🔧 Running custom migration with psql..."
# Since we're on Render, create a temporary Node script to run psql
cat > /tmp/migrate.js << 'EOF'
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await client.connect();
    
    const fs = require('fs');
    const path = require('path');
    
    console.log('Reading migration script...');
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
    
    console.log('Executing migration commands...');
    await client.query(migrationSQL);
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
EOF

node /tmp/migrate.js

const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    await client.connect();
    
    console.log('📋 Reading migration script...');
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'migrate.sql'), 'utf8');
    
    console.log('🔧 Executing migration commands...');
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
"
