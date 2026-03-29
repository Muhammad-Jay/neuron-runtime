import {
    pgTable,
    uuid,
    integer,
    jsonb,
    timestamp,
} from "drizzle-orm/pg-core"
import { workflows } from "./workflowSchema"

export const workflowVersions = pgTable("workflow_versions", {
    id: uuid("id")
        .primaryKey()
        .unique()
        .defaultRandom(),

    workflowId: uuid("workflow_id")
        .notNull()
        .references(() => workflows.id, { onDelete: "cascade" }),

    versionNumber: integer("version_number")
        .notNull(),

    nodes: jsonb("nodes")
        .notNull(),

    edges: jsonb("edges")
        .notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
})