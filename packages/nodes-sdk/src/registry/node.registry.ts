import http from "@neuron/node-http-request";
import {NodeDefinition} from "@neuron/shared";

const nodeRegistry: Record<string, NodeDefinition> = {};

export function loadNodes(){
    const plugins = [
        http.nodePlugin
    ]

    for (const plugin of plugins){
        registerNode(plugin);
    }
}

export function registerNode(node: NodeDefinition) {
    nodeRegistry[node.type] = node;
}

export function getNode(type: string) {
    return nodeRegistry[type];
}

export function getAllNodes() {
    return Object.values(nodeRegistry);
}