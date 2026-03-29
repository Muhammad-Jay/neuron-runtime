CREATE TABLE "workflow_nodes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"workflow_id" uuid NOT NULL,
	"type" text NOT NULL,
	"config" jsonb NOT NULL,
	"position_x" integer,
	"position_y" integer
);
--> statement-breakpoint
CREATE TABLE "workflow_edges" (
	"id" uuid PRIMARY KEY NOT NULL,
	"workflow_id" uuid NOT NULL,
	"config" jsonb NOT NULL,
	"source" text NOT NULL,
	"target" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "status" "workflow_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "workflow_nodes" ADD CONSTRAINT "workflow_nodes_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workflow_edges" ADD CONSTRAINT "workflow_edges_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;