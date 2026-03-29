import {pgTable, uuid, text, timestamp, jsonb, boolean} from "drizzle-orm/pg-core";
import {users} from "./authSchema";
import {workflows} from "./workflowSchema";

export const deployedWorkflows = pgTable("deployed_workflows", {
    id: uuid("id").primaryKey().defaultRandom(),

    workflowId: uuid("workflow_id")
        .references(() => workflows.id)
        .notNull()
        .unique(),

    nodes: jsonb("nodes").notNull(),
    edges: jsonb("edges").notNull(),

    userId: uuid('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),

    secretKey: text("secret_key").notNull().unique(),

    name: text("name").notNull(),
    private: boolean("private").default(true).notNull(),
    isActive: boolean("status").default(true).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});