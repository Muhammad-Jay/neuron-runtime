import {WorkflowNode} from "../types/workflow/workflow.types";

interface ExecutionMetadata {
    nodeType: string;
    executedAt: string;
    latency: string;
    durationMs: number;
}

export interface ContextEntry<T = any> {
    metadata: ExecutionMetadata;
    payload: T;
}

export const createContextEntry = (
    node: any,
    output: any,
    startTime: number
): ContextEntry => {
    const endTime = performance.now();
    const durationMs = endTime - startTime;

    // Automatic unit scaling for professional UI display
    const latency = durationMs < 1000
        ? `${durationMs.toFixed(2)}ms`
        : `${(durationMs / 1000).toFixed(3)}s`;

    return {
        metadata: {
            nodeType: node.type,
            executedAt: new Date().toISOString(),
            latency,
            durationMs: parseFloat(durationMs.toFixed(4)),
        },
        payload: output,
    };
};