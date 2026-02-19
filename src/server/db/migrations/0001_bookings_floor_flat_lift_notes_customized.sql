-- Add floor, flat, lift, pickup/dropoff notes, and customized items to bookings
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_floor_number" integer;
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_flat_unit" varchar(50);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_has_lift" boolean;
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "pickup_notes" text;
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_floor_number" integer;
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_flat_unit" varchar(50);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_has_lift" boolean;
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "dropoff_notes" text;
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN IF NOT EXISTS "has_customized_items" boolean;
