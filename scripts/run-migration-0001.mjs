/**
 * Applies migration 0001: adds pickup/dropoff floor, flat, lift, notes, has_customized_items to bookings.
 * Loads .env and .env.local for DATABASE_URL. Run from project root: node scripts/run-migration-0001.mjs
 */
import pkg from 'pg';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    const path = resolve(process.cwd(), file);
    if (existsSync(path)) {
      const content = readFileSync(path, 'utf8');
      for (const line of content.split('\n')) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
      }
    }
  }
}
loadEnv();

const { Client } = pkg;

const ALTERS = [
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_floor_number" integer',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_flat_unit" varchar(50)',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_has_lift" boolean',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_notes" text',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_floor_number" integer',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_flat_unit" varchar(50)',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_has_lift" boolean',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_notes" text',
  'ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "has_customized_items" boolean',
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL not set. Ensure .env or .env.local exists.');
    process.exit(1);
  }
  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    for (const sql of ALTERS) {
      await client.query(sql);
      console.log('OK:', sql.split('ADD COLUMN')[1]?.trim().split(' ')[0] || sql);
    }
    console.log('Migration 0001 applied.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
