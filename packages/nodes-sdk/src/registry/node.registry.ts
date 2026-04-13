import { NodeDefinition } from "../types/node-sdk.types";

const nodeRegistry: Record<string, NodeDefinition> = {};

export function registerNode(node: NodeDefinition) {
    nodeRegistry[node.type] = node;
}

export function getNode(type: string) {
    return nodeRegistry[type];
}

export function getAllNodes() {
    return Object.values(nodeRegistry);
}