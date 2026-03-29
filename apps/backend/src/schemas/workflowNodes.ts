import {
    pgTable,
    uuid,
    text,
    integer, jsonb,
} from "drizzle-orm/pg-core"
import {workflows} from "./workflowSchema";
import {relations} from "drizzle-orm";

export const workflowNodes = pgTable("workflow_nodes", {
    id: uuid("id").primaryKey(),
    workflowId: uuid("workflow_id")
        .references(() => workflows.id)
        .notNull(),
    type: text("type").notNull(),
    config: jsonb("config").notNull(),
    positionX: integer("position_x"),
    positionY: integer("position_y"),
});

// Relations
export const nodeRelations = relations(workflowNodes, ({ one }) => ({
    workflow: one(workflows, {
        fields: [workflowNodes.workflowId],
        references: [workflows.id],
    }),
}));