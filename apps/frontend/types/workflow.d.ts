import {WorkflowActionType, WorkflowEditorActionType} from "@/constants";
import type {WorkflowDefinition, WorkflowType, WorkflowEdge, BaseNode, WorkflowNode} from "@neuron/shared";

export type NewWorkflowGeneralType = {
    name: string;
    description?: string;
    category: WorkflowCategoryType;
    template: string;
}

export type WorkflowCategoryType = "AI_Agent_Workflow" | "Automation_Workflow" | "Hybrid" | "Custom" | "";

export type WorkflowAction =
    | {
    type: WorkflowActionType.SET_WORKFLOWS,
    payload: WorkflowType[]
} | {
    type: WorkflowActionType.ADD_WORKFLOW,
    payload: WorkflowType
} | {
    type: WorkflowActionType.DELETE_WORKFLOW,
    id: string
} | {
    type: WorkflowActionType.UPDATE_WORKFLOW,
    id: string,
    payload?: Partial<WorkflowType>
} | {
    type: WorkflowActionType.UPDATE_STATUS,
    id: string,
    status: WorkflowType["status"]
}

export type WorkflowEditorAction =
    | {
    type: WorkflowEditorActionType.SET_WORKFLOW_ID;
    workflowId: string;
}

    | {
    type: WorkflowEditorActionType.SET_GRAPH;
    payload: WorkflowDefinition;
}

    | {
    type: WorkflowEditorActionType.ADD_NODE;
    payload: WorkflowNode;
}

    | {
    type: WorkflowEditorActionType.ADD_EDGE;
    payload: WorkflowEdge;
}

    | {
    type: WorkflowEditorActionType.UPDATE_NODE;
    id: string;
    payload: any;
}

    | {
    type: WorkflowEditorActionType.UPDATE_EDGE;
    id: string;
    payload: Partial<WorkflowEdge>;
}

    | {
    type: WorkflowEditorActionType.DELETE_NODE;
    id: string;
} | {
    type: WorkflowEditorActionType.UPDATE_NODE_POSITION;
    id: string;
    position: {
        x: number;
        y: number;
    }
}

    | {
    type: WorkflowEditorActionType.DELETE_EDGE;
    id: string;
}

    | {
    type: WorkflowEditorActionType.UPDATE_WORKFLOW;
    payload: Partial<WorkflowType>;
}

    | {
    type: WorkflowEditorActionType.UPDATE_STATUS;
    status: WorkflowType["status"];
}

    | {
        type: WorkflowEditorActionType.NODE_EXECUTION_START;
        nodeId: string;
}   | {
    type: WorkflowEditorActionType.NODE_EXECUTION_SUCCESS;
    nodeId: string;
    output: any;
}   | {
    type: WorkflowEditorActionType.NODE_EXECUTION_ERROR;
    nodeId: string;
    error: any;
}  | {
    type: WorkflowEditorActionType.EDGE_EXECUTION_START;
    edgeId: string;
}  | {
    type: WorkflowEditorActionType.EDGE_EXECUTION_END;
    edgeId: string;
}  | {
    type: WorkflowEditorActionType.RESET_NODE_STATUS;
}  | {
    type: WorkflowEditorActionType.UPDATE_DIRTY_STATE;
    state?: boolean
}  | {
    type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS;
    payload: Record<string, any>;
}  | {
    type: WorkflowEditorActionType.SET_DEPLOYMENT;
    payload: Record<string, any> | null;
}  | {
    type: WorkflowEditorActionType.UPDATE_DEPLOYMENT;
    payload: Partial<Record<string, any>>;
}

export interface WorkflowVariable {
    id: string
    label: string
}

export type Secret = {
    id: string
    name: string
    createdAt?: string
}
