import {WorkflowEdge} from "@shared/types/edge.type";

export function convertEdgeToDBSchema(edge: WorkflowEdge) {
    return {
        id: edge.id,
        config: {},
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle as string ?? edge.id,
        targetHandle: edge.targetHandle as string ?? edge.id,
    }
}