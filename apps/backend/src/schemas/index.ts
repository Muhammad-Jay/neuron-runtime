import {relations} from "drizzle-orm";
import {workspaces} from "./workspaceSchema";
import {workflows} from "./workflowSchema";

export * from "./workspaceSchema";
export * from "./workflowSchema";
export * from "./workflowVersionSchema";
export * from "./executionSchema";
export * from "./executionLogSchema";
export * from "./authSchema";
export * from "./workflowNodes";
export * from "./workflowEdges";
export * from "./vaultSecrets";
export * from "./globalVariablesSchema";
export * from "./deployedWorkflows";


export const workspacesRelations = relations(workspaces, ({ many }) => ({
    workflows: many(workflows),
}));

export const workflowsRelations = relations(workflows, ({ one }) => ({
    workspace: one(workspaces, {
        fields: [workflows.workspaceId],
        references: [workspaces.id],
    }),
}));