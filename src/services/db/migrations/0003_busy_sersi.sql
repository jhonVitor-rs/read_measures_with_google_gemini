CREATE TABLE IF NOT EXISTS "measure" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_code" text NOT NULL,
	"measure_datetime" date NOT NULL,
	"measure_type" text NOT NULL,
	"image_url" text,
	"has_confirmed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
