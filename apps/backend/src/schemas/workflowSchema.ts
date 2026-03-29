import {
    pgTable,
    uuid,
    text,
    boolean,
    timestamp, primaryKey, serial, pgEnum, integer,
} from "drizzle-orm/pg-core"
import {users} from "./authSchema";
import {relations} from "drizzle-orm";
import {workflowNodes} from "./workflowNodes";
import {workflowEdges} from "./workflowEdges";
import {executions} from "./executionSchema";

export const workflowStatusEnum = pgEnum("workflow_status", [
    "draft",
    "active",
    "archived",
])

export const workflows = pgTable("workflows", {
    id: uuid("id")
        .primaryKey()
        .unique()
        .defaultRandom(),

    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    name: text("name")
        .notNull(),

    description: text("description"),

    runs: integer("runs"),

    isActive: boolean("is_active")
        .default(true)
        .notNull(),

    status: workflowStatusEnum("status").default('draft').notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
})

export const workflowRelations = relations(workflows, ({ many }) => ({
    nodes: many(workflowNodes),
    edges: many(workflowEdges),
    executions: many(executions),
}));