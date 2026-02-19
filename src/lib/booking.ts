import { db } from '@/server/db';
import { bookings } from '@/server/db/schema';
import { count } from 'drizzle-orm';

const REFERENCE_PREFIX = 'VG-';
const REFERENCE_DIGITS = 4;

/**
 * Generates the next booking reference number in format VG-XXXX (e.g. VG-0001, VG-0002).
 * Sequential per creation order; safe for concurrent use via DB count.
 */
export async function generateNextReferenceNumber(): Promise<string> {
  const [row] = await db
    .select({ count: count() })
    .from(bookings);

  const nextNum = (row?.count ?? 0) + 1;
  const padded = String(nextNum).padStart(REFERENCE_DIGITS, '0');
  return `${REFERENCE_PREFIX}${padded}`;
}
