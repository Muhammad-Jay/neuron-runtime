import {jsonb, pgTable, text, uuid} from "drizzle-orm/pg-core";
import {workflows} from "./workflowSchema";
import { relations } from "drizzle-orm";

export const workflowEdges = pgTable("workflow_edges", {
    id: uuid("id").primaryKey(),
    workflowId: uuid("workflow_id")
        .references(() => workflows.id)
        .notNull(),
    config: jsonb("config").notNull(),
    source: text("source").notNull(),
    target: text("target").notNull(),
    sourceHandle: text("source_handle").notNull(),
    targetHandle: text("target_handle"),
});

// Relations
export const edgeRelations = relations(workflowEdges, ({ one }) => ({
    workflow: one(workflows, {
        fields: [workflowEdges.workflowId],
        references: [workflows.id],
    }),
}));