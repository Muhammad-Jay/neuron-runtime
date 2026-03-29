import {
    pgTable,
    uuid,
    text,
    jsonb,
    timestamp, pgEnum,
} from "drizzle-orm/pg-core"
import { workflows } from "./workflowSchema"
import { workflowVersions } from "./workflowVersionSchema"
import {users} from "./authSchema";
import {relations} from "drizzle-orm";
import {executionLogs} from "./executionLogSchema";

export const executionStatusEnum = pgEnum("execution_status", [
    "pending",
    "running",
    "success",
    "failed",
])

export const executions = pgTable("executions", {
    id: uuid("id")
        .primaryKey()
        .unique()
        .defaultRandom(),

    workflowId: uuid("workflow_id")
        .notNull()
        .references(() => workflows.id),

    workflowVersionId: uuid("workflow_version_id")
        .notNull()
        .references(() => workflowVersions.id),

    status: executionStatusEnum("status").notNull().default("pending"),

    startedAt: timestamp("started_at", { withTimezone: true })
        .defaultNow()
        .notNull(),

    finishedAt: timestamp("finished_at", { withTimezone: true }),

    result: jsonb("result"),
})

// Relations
export const executionRelations = relations(
    executions,
    ({ one, many }) => ({
        workflow: one(workflows, {
            fields: [executions.workflowId],
            references: [workflows.id],
        }),
        logs: many(executionLogs),
    })
);