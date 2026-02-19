import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * Normalize DATABASE_URL to add uselibpqcompat=true when sslmode=require (or prefer/verify-ca)
 * to silence the pg-connection-string v3/v9 SSL semantics warning and opt into future behavior.
 */
function getConnectionString(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  try {
    const parsed = new URL(url);
    const sslmode = parsed.searchParams.get('sslmode');
    if (
      sslmode &&
      ['prefer', 'require', 'verify-ca'].includes(sslmode) &&
      !parsed.searchParams.has('uselibpqcompat')
    ) {
      parsed.searchParams.set('uselibpqcompat', 'true');
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}

const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: false,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
