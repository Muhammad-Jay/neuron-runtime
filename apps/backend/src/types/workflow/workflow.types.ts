import type {InferSelectModel, InferInsertModel} from "drizzle-orm";

import {
    deployedWorkflows,
    executionLogs,
    executions,
    globalVariables,
    workflowEdges,
    workflowNodes,
    workflows,
    workflowVersions
} from "../../schemas";

export type Workflow = InferSelectModel<typeof workflows>
export type NewWorkflow = InferInsertModel<typeof workflows>

export type WorkflowVersion = InferSelectModel<typeof workflowVersions>
export type NewWorkflowVersion = InferInsertModel<typeof workflowVersions>

export type Execution = InferSelectModel<typeof executions>
export type NewExecution = InferInsertModel<typeof executions>

export type ExecutionLog = InferSelectModel<typeof executionLogs>
export type NewExecutionLog = InferInsertModel<typeof executionLogs>

export type GlobalVariable = typeof globalVariables.$inferSelect;
export type NewGlobalVariable = typeof globalVariables.$inferInsert;

export type WorkflowNode = InferSelectModel<typeof workflowNodes>
export type NewWorkflowNode = InferInsertModel<typeof workflowNodes>

export type WorkflowEdge = InferSelectModel<typeof workflowEdges>
export type NewWorkflowEdge = InferInsertModel<typeof workflowEdges>

export type DeployedWorkflow = InferSelectModel<typeof deployedWorkflows>
export type NewDeployedWorkflow = InferInsertModel<typeof deployedWorkflows>

