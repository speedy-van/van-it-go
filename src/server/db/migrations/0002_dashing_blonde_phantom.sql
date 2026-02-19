CREATE TABLE IF NOT EXISTS "password_reset_tokens" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup_floor_number" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup_flat_unit" varchar(50);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup_has_lift" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "pickup_notes" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "dropoff_floor_number" integer;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "dropoff_flat_unit" varchar(50);--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "dropoff_has_lift" boolean;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "dropoff_notes" text;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "has_customized_items" boolean;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_idx" ON "password_reset_tokens" ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_reset_tokens_user_id_idx" ON "password_reset_tokens" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "password_reset_tokens_expires_at_idx" ON "password_reset_tokens" ("expires_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
