import { db } from '@/server/db';
import { users } from '@/server/db/schema';
import { generateId } from '@/utils/helpers';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create sample users
    const sampleUsers = [
      {
        id: generateId(),
        email: 'customer@example.com',
        name: 'John Doe',
        role: 'customer' as const,
        emailVerified: true,
      },
      {
        id: generateId(),
        email: 'driver@example.com',
        name: 'Jane Smith',
        role: 'driver' as const,
        emailVerified: true,
      },
      {
        id: generateId(),
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin' as const,
        emailVerified: true,
      },
    ];

    // Insert users
    for (const user of sampleUsers) {
      await db.insert(users).values(user).onConflictDoNothing();
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seed();
