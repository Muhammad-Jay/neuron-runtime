import {
    WorkflowNode,
    ValidationError,
} from "@neuron/shared";

export type ValidationFunction = (node: WorkflowNode) => ValidationError[];