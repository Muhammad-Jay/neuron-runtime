ALTER TABLE "executions" DROP CONSTRAINT "executions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "executions" DROP COLUMN "user_id";