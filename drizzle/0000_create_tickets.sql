CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"priority" text,
	"category" text,
	"summary" text,
	"draft_reply" text,
	"analyzed_at" timestamp
);
