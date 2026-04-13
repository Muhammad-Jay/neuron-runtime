import { NodeType, BaseNodeConfig } from "@neuron/shared";

export interface NodeExecutorContext<T = any> {
    node: {
        id: string;
        type: NodeType;
        config: BaseNodeConfig;
    };
    inputs: Record<string, any>;
    variables?: Record<string, any>;
}

export interface NodeExecutor<TOutput = any> {
    (ctx: NodeExecutorContext): Promise<TOutput> | TOutput;
}