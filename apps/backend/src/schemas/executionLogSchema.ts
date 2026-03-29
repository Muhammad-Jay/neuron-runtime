import {
    pgTable,
    uuid,
    text,
    jsonb,
    timestamp, serial,
} from "drizzle-orm/pg-core"
import { executions } from "./executionSchema"

export const executionLogs = pgTable("execution_logs", {
    id: uuid("id")
        .primaryKey()
        .unique()
        .defaultRandom(),

    executionId: uuid("execution_id")
        .notNull()
        .references(() => executions.id, { onDelete: "cascade" }),

    nodeId: text("node_id")
        .notNull(),

    log: jsonb("log")
        .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
})