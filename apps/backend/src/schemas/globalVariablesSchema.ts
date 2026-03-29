import {
    pgTable,
    uuid,
    text,
    timestamp,
} from "drizzle-orm/pg-core";
import { workflows } from "./workflowSchema";

export const globalVariables = pgTable("global_variables", {
    id: uuid("id").primaryKey().defaultRandom(),
    workflowId: uuid("workflow_id")
        .references(() => workflows.id, { onDelete: "cascade" })
        .notNull(),
    key: text("key").notNull(),
    value: text("value").default(""),
    type: text("type").default("string").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});