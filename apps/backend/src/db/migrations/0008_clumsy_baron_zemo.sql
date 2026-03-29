CREATE TABLE "deployed_workflows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workflow_id" uuid NOT NULL,
	"nodes" jsonb NOT NULL,
	"edges" jsonb NOT NULL,
	"user_id" uuid NOT NULL,
	"secret_key" text NOT NULL,
	"name" text NOT NULL,
	"private" boolean DEFAULT true NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deployed_workflows_secret_key_unique" UNIQUE("secret_key")
);
--> statement-breakpoint
ALTER TABLE "deployed_workflows" ADD CONSTRAINT "deployed_workflows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;