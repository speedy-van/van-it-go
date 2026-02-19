CREATE TABLE IF NOT EXISTS "quotes" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"from_postcode" varchar(20) NOT NULL,
	"to_postcode" varchar(20) NOT NULL,
	"move_size" varchar(20) NOT NULL,
	"from_address" varchar(500),
	"to_address" varchar(500),
	"pickup_lat" numeric(10, 8) NOT NULL,
	"pickup_lng" numeric(11, 8) NOT NULL,
	"dropoff_lat" numeric(10, 8) NOT NULL,
	"dropoff_lng" numeric(11, 8) NOT NULL,
	"price_gbp" numeric(10, 2) NOT NULL,
	"distance_miles" numeric(8, 2) NOT NULL,
	"eta_minutes" integer NOT NULL,
	"volume_cubic_meters" numeric(6, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
