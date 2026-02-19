import bcryptjs from 'bcryptjs';
import pkg from 'pg';
import { nanoid } from 'nanoid';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env then .env.local so DATABASE_URL is set when run via npm run db:seed-admin
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

const ADMIN_EMAIL = 'ahmadalwakai76@gmail.com';
const ADMIN_PASSWORD = 'Aa234311Aa@@@';

async function seedAdmin() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not set');
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Hash the password
    const passwordHash = await bcryptjs.hash(ADMIN_PASSWORD, 10);

    // Check if admin already exists
    const existingAdmin = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [ADMIN_EMAIL]
    );

    if (existingAdmin.rows.length > 0) {
      // Update password so demo credentials always work
      await client.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
        [passwordHash, ADMIN_EMAIL]
      );
      console.log(`✅ Admin user password updated for ${ADMIN_EMAIL}`);
      console.log(`   You can sign in with the demo credentials on the login page.`);
      return;
    }

    // Insert admin user
    const userId = nanoid();
    await client.query(
      `INSERT INTO users (id, email, name, password_hash, role, email_verified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [userId, ADMIN_EMAIL, 'Admin', passwordHash, 'admin', true]
    );

    console.log(`✅ Admin user created successfully`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Role: admin`);
    console.log(`   Email Verified: true`);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seedAdmin();
