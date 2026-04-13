import {BaseNode, WorkflowNode} from "./node.types";
import {WorkflowEdge} from "./edge.type";

export type workflowStatus = "draft" | "active" | "archived";

export type WorkflowType = {
    id: string;
    name: string;
    description: string;
    isActive?: boolean;
    workspaceId: string | null;
    status: workflowStatus;
    runs?: number;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type NewWorkflowType = {
    name: string;
    description: string;
    isActive: boolean;
    status: workflowStatus;
    runs?: number;
    userId?: string;
}


export type WorkflowTableSchemaType = {
    name: string;
    description: string;
    isActive: boolean;
    status: workflowStatus;
    runs?: number;
    userId: string;
}



export interface WorkflowDefinition {
    nodes: Record<string, WorkflowNode>
    edges: Record<string, WorkflowEdge>
}


export type GlobalVariable = {
    id: string;
    key: string;
    value: string;
    type: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type IGlobalVariablesDefinition = Record<string, GlobalVariable>;