CREATE TYPE "public"."execution_status" AS ENUM('pending', 'running', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."workflow_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
ALTER TABLE "workflows" ADD COLUMN "runs" integer;