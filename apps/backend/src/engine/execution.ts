'use client';

import type { WorkflowDefinition } from "@neuron/shared";
import {vaultService} from "./vault";
import {workflowBroadcast} from "../services/supabase/supabase.services";
import {WorkflowEditorActionType} from "../constant";
import {nodeRegistry} from "./node.registry";
import {getGlobalVariables} from "../services/repository/global.variables.repository";
import {resolveTemplate} from "./resolveTemplate";
import {WorkflowNode, WorkflowEdge} from "../types/workflow/workflow.types";

export type FinalResponseType = {
    status: number;
    headers?: Record<string, string>;
    body?: Record<string, string>;
} | null;

async function resolveConfig(config: any, context: Record<string, any>, variables?: Record<string, string>): Promise<any> {
    if (typeof config === "string") return await resolveTemplate(config, context, variables);
    if (Array.isArray(config)) {
        return await Promise.all(config.map(v => resolveConfig(v, context, variables)));
    }
    if (config && typeof config === "object") {
        const result: any = {};
        for (const key of Object.keys(config)) {
            result[key] = await resolveConfig(config[key], context, variables);
        }
        return result;
    }
    console.log("resolved config:", config);
    return config;
}


export async function executeWorkflow(
    runId: string,
    graph: {
        nodes: WorkflowNode[],
        edges: WorkflowEdge[],
    },
) {
    const { nodes, edges } = graph;
    const { dispatch } = workflowBroadcast(runId);

    const nodesContext: Record<string, any> = {};
    const globalVariables: Record<string, string> = {};
    const completed = new Set<string>();
    const running = new Set<string>();
    const validNodeIds = new Set(nodes.map(n => n.id));
    const incoming: Record<string, string[]> = {};
    const outgoing: Record<string, string[]> = {};

    // --- NEW: THE RESPONSE CONTAINER ---
    let finalResponse: Record<string, any> | null = null;

    // 1. Fetch and Map Global Variables correctly (By KEY, not ID)
    const dbVariables = await getGlobalVariables(runId);
    if (dbVariables) {
        for (const variable of dbVariables) {
            globalVariables[variable.key] = variable.value as string;
        }
    }

    // 2. Pre-build Adjacency Maps for performance
    for (const node of nodes) {
        incoming[node.id] = [];
        outgoing[node.id] = [];
    }

    edges.forEach(e => {
        if (validNodeIds.has(e.source) && validNodeIds.has(e.target)) {
            incoming[e.target]!.push(e.source);
            outgoing[e.source]!.push(e.target);
        } else {
            console.warn(`[Executor] Skipping orphaned edge: ${e.source} -> ${e.target}`);
        }
    });

    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

    async function runNode(nodeId: string) {
        if (completed.has(nodeId) || running.has(nodeId)) return;

        const node = nodeMap[nodeId];
        if (!node) throw new Error(`No node found with ID: ${nodeId}`);

        running.add(nodeId);
        const outgoingEdges = edges.filter(e => e.source === nodeId);

        // Visuals: Signal start
        await dispatch(WorkflowEditorActionType.NODE_EXECUTION_START, { nodeId });

        try {
            // 3. Resolve Configuration with full Context
            // This injects {{nodeId...}} and {{Global.KEY}} values
            const resolvedConfig = await resolveConfig(node.config, nodesContext, globalVariables);

            const executor = nodeRegistry[node.type];
            if (!executor) throw new Error(`No executor found for type: ${node.type}`);

            await new Promise(r => setTimeout(r, 400));

            console.log(`from ${node.type}: `, resolvedConfig)
            const output = await executor({
                node: { ...node, config: resolvedConfig },
                // Pass the first available parent output as a direct input for simple nodes
                inputs: nodesContext[incoming[nodeId]![0]!]
            });

            // --- NEW: CAPTURE TERMINAL DATA ---
            if (output && output.__isTerminal) {
                console.log("Respond Node output: ", output);
                finalResponse = {
                    status: output.status,
                    headers: output.headers,
                    body: output.body
                };
            }

            // 4. Update Context & Mark Progress
            nodesContext[nodeId] = output;
            completed.add(nodeId);

            await dispatch(WorkflowEditorActionType.NODE_EXECUTION_SUCCESS, { nodeId, output });

            // 5. Sophisticated Branching Logic
            let nextNodeIds: string[] = [];

            if (node.type === "condition") {
                const branch = output ? "true" : "false";
                const targetEdges = edges.filter(e => e.source === nodeId && e.sourceHandle === branch);
                nextNodeIds = targetEdges.map(e => e.target);

                // Handle Animations for specific branch
                for (const edge of outgoingEdges) {
                    const isTarget = targetEdges.some(te => te.id === edge.id);
                    await dispatch(isTarget
                            ? WorkflowEditorActionType.EDGE_EXECUTION_START
                            : WorkflowEditorActionType.EDGE_EXECUTION_END,
                        { edgeId: edge.id });
                }
            }
            else if (node.type === "decisionNode") {
                // 'output' is now an array of truthy rule IDs (e.g., ["rule_1", "rule_3"])
                const matchedRuleIds = Array.isArray(output) ? output : [];

                const targetEdges = edges.filter(e =>
                    e.source === nodeId && matchedRuleIds.includes(e.sourceHandle ?? "")
                );

                nextNodeIds = targetEdges.map(e => e.target);

                // Visuals: Start only the triggered paths, end the others
                for (const edge of outgoingEdges) {
                    const isTriggered = targetEdges.some(te => te.id === edge.id);
                    await dispatch(isTriggered
                            ? WorkflowEditorActionType.EDGE_EXECUTION_START
                            : WorkflowEditorActionType.EDGE_EXECUTION_END,
                        { edgeId: edge.id });
                }
            }
            else {
                // Standard nodes: trigger all outgoing paths
                nextNodeIds = outgoing[nodeId]!;
                for (const edge of outgoingEdges) {
                    await dispatch(WorkflowEditorActionType.EDGE_EXECUTION_START, { edgeId: edge.id });
                }
            }

            // 6. Trigger ready children (Parallel Execution)
            const readyNodes = nextNodeIds.filter(id =>
                incoming[id]!.every(parentId => completed.has(parentId))
            );

            await Promise.all(readyNodes.map(runNode));

        } catch (e: any) {
            console.error(`[Executor] Error in node ${nodeId}:`, e);
            await dispatch(WorkflowEditorActionType.NODE_EXECUTION_ERROR, { nodeId, error: e.message });
        } finally {
            running.delete(nodeId);
        }
    }

    // Execute root nodes (those with zero dependencies)
    const startNodes = nodes.filter(n => incoming[n.id]!.length === 0).map(n => n.id);
    await Promise.all(startNodes.map(runNode));

    return {
        nodesContext,
        globalVariables,
        response: finalResponse as FinalResponseType
    };
}