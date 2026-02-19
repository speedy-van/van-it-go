import {
  pgTable,
  text,
  varchar,
  decimal,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'guest',
  'customer',
  'driver',
  'admin',
]);

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'accepted',
  'in_progress',
  'completed',
  'cancelled',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'booking_confirmed',
  'driver_assigned',
  'en_route',
  'completed',
  'payment_receipt',
]);

// Users table
export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }),
    role: userRoleEnum('role').default('guest').notNull(),
    emailVerified: boolean('email_verified').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('users_email_idx').on(table.email),
      roleIdx: index('users_role_idx').on(table.role),
    };
  }
);

// Drivers table
export const drivers = pgTable(
  'drivers',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    licenseNumber: varchar('license_number', { length: 100 }).notNull(),
    licenseExpiry: timestamp('license_expiry').notNull(),
    insuranceExpiry: timestamp('insurance_expiry').notNull(),
    rating: decimal('rating', { precision: 3, scale: 2 }).default('5.00'),
    completedJobs: integer('completed_jobs').default(0),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('drivers_user_id_idx').on(table.userId),
      isActiveIdx: index('drivers_is_active_idx').on(table.isActive),
    };
  }
);

// Bookings table
export const bookings = pgTable(
  'bookings',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    referenceNumber: varchar('reference_number', { length: 20 }).unique(),
    customerId: varchar('customer_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    driverId: varchar('driver_id', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
    }),
    pickupAddress: varchar('pickup_address', { length: 500 }).notNull(),
    dropoffAddress: varchar('dropoff_address', { length: 500 }).notNull(),
    pickupLat: decimal('pickup_lat', { precision: 10, scale: 8 }).notNull(),
    pickupLng: decimal('pickup_lng', { precision: 11, scale: 8 }).notNull(),
    dropoffLat: decimal('dropoff_lat', { precision: 10, scale: 8 }).notNull(),
    dropoffLng: decimal('dropoff_lng', { precision: 11, scale: 8 }).notNull(),
    scheduledAt: timestamp('scheduled_at').notNull(),
    estimatedDistance: decimal('estimated_distance', {
      precision: 8,
      scale: 2,
    }).notNull(),
    estimatedDuration: integer('estimated_duration').notNull(), // minutes
    itemCount: integer('item_count').notNull(),
    status: bookingStatusEnum('status').default('pending').notNull(),
    quotePrice: decimal('quote_price', { precision: 10, scale: 2 }).notNull(),
    lockedPrice: decimal('locked_price', { precision: 10, scale: 2 }),
    priceLockFee: decimal('price_lock_fee', { precision: 10, scale: 2 }),
    finalPrice: decimal('final_price', { precision: 10, scale: 2 }),
    serviceType: varchar('service_type', { length: 100 }).notNull(),
    notes: text('notes'),
    pickupFloorNumber: integer('pickup_floor_number'),
    pickupFlatUnit: varchar('pickup_flat_unit', { length: 50 }),
    pickupHasLift: boolean('pickup_has_lift'),
    pickupNotes: text('pickup_notes'),
    dropoffFloorNumber: integer('dropoff_floor_number'),
    dropoffFlatUnit: varchar('dropoff_flat_unit', { length: 50 }),
    dropoffHasLift: boolean('dropoff_has_lift'),
    dropoffNotes: text('dropoff_notes'),
    hasCustomizedItems: boolean('has_customized_items'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      referenceNumberIdx: uniqueIndex('bookings_reference_number_idx').on(table.referenceNumber),
      customerIdIdx: index('bookings_customer_id_idx').on(table.customerId),
      driverIdIdx: index('bookings_driver_id_idx').on(table.driverId),
      statusIdx: index('bookings_status_idx').on(table.status),
      scheduledAtIdx: index('bookings_scheduled_at_idx').on(table.scheduledAt),
    };
  }
);

// Payments table
export const payments = pgTable(
  'payments',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    bookingId: varchar('booking_id', { length: 36 })
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    status: paymentStatusEnum('status').default('pending').notNull(),
    stripePaymentIntentId: varchar('stripe_payment_intent_id', {
      length: 255,
    }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      bookingIdIdx: index('payments_booking_id_idx').on(table.bookingId),
      userIdIdx: index('payments_user_id_idx').on(table.userId),
      statusIdx: index('payments_status_idx').on(table.status),
    };
  }
);

// Notifications table
export const notifications = pgTable(
  'notifications',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    read: boolean('read').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('notifications_user_id_idx').on(table.userId),
      readIdx: index('notifications_read_idx').on(table.read),
    };
  }
);

// Carbon Offset table
export const carbonOffsets = pgTable(
  'carbon_offsets',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    bookingId: varchar('booking_id', { length: 36 })
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    distanceKm: decimal('distance_km', { precision: 8, scale: 2 }).notNull(),
    estimatedCO2g: integer('estimated_co2_g').notNull(),
    offsetAmount: decimal('offset_amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).default('GBP'),
    provider: varchar('provider', { length: 50 }).default('ecologi'),
    transactionId: varchar('transaction_id', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      bookingIdIdx: index('carbon_offsets_booking_id_idx').on(table.bookingId),
    };
  }
);

// User Sessions (for NextAuth)
export const sessions = pgTable(
  'sessions',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      userIdIdx: index('sessions_user_id_idx').on(table.userId),
      expiresAtIdx: index('sessions_expires_at_idx').on(table.expiresAt),
    };
  }
);

// Password reset tokens (for forgot-password flow; any role: admin, driver, customer)
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    userId: varchar('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      tokenIdx: uniqueIndex('password_reset_tokens_token_idx').on(table.token),
      userIdIdx: index('password_reset_tokens_user_id_idx').on(table.userId),
      expiresAtIdx: index('password_reset_tokens_expires_at_idx').on(table.expiresAt),
    };
  }
);
