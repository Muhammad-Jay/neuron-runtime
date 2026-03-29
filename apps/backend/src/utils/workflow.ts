import type {Workflow} from "../types/workflow/workflow.types.js";
import {WorkflowDTO} from "../models/workflowDTO";
import {WorkflowEdge} from "@shared/types/edge.type";
import {BaseNode} from "@shared/types/node.types";

export function toWorkflowDTO(workflow: Workflow): WorkflowDTO {
    return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        status: "draft",
        runs: 0,
        isActive: workflow.isActive,
        createdAt: workflow.createdAt.toISOString(),
    }
}

export function findNode(
    nodes: BaseNode[],
    nodeId: string
): BaseNode | undefined {
    return nodes.find((node) => node.id === nodeId)
}

export function getNextNodes(  edges: WorkflowEdge[],  currentNodeId: string): string[] {
    return edges    .filter((edge) => edge.source === currentNodeId)    .map((edge) => edge.target)
}

export function findTriggerNode(
    nodes: BaseNode[]
): BaseNode | undefined {
    return nodes.find((node) => node.type === "trigger")
}