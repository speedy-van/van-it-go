import { z } from 'zod';

export const bookingSchema = z.object({
  pickupAddress: z.string().min(5),
  dropoffAddress: z.string().min(5),
  pickupLat: z.number(),
  pickupLng: z.number(),
  dropoffLat: z.number(),
  dropoffLng: z.number(),
  scheduledAt: z.date(),
  itemCount: z.number().min(1),
  serviceType: z.string(),
  notes: z.string().optional(),
});

export const paymentSchema = z.object({
  amount: z.number().min(0.01),
  bookingId: z.string(),
});

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
