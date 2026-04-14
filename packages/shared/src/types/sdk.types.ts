import type {LucideIcon} from "lucide-react";
import {NodeConfigType, NodeType, WorkflowNode} from "./node.types";

export interface NodeExecutorContext {
    node: WorkflowNode;
    inputs: any;
    env?: Record<string, any>;
}

export type NodeExecutor = (
    ctx: NodeExecutorContext
) => Promise<any>;

export interface NodeDefinition {
    type: NodeType;

    // backend execution
    executor: NodeExecutor;

    // frontend + UI
    ui: {
        key: string;
        label: string;
        description: string;
        category: string;
        icon: LucideIcon;
    };

    // default config (your existing structure)
    defaultConfig: NodeConfigType;
}