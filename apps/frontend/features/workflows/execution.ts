'use client';

import { WorkflowDefinition } from "../../../shared/src/types/workflow.types";
import { WorkflowEditorActionType } from "@/constants";
import { WorkflowEditorAction } from "@/types/workflow";
import {NodeConfigType} from "../../../shared/src/types/node.types";
import {vaultService} from "@/features/workflows/vaultService";
import {createGoogleGenerativeAI, google} from "@ai-sdk/google";
import {generateText} from "ai";

// Support for UUIDs and deep paths: node-uuid.data.item
const TEMPLATE_REGEX = /{{\s*([\w.-]+)\s*}}/g;
const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Traverses the context object to find a value at a given path
 */
function safePathLookup(obj: any, path: string) {
    const parts = path.split(".");
    let current = obj;

    for (const part of parts) {
        if (BLOCKED_KEYS.has(part)) return undefined;
        if (current === null || current === undefined) return undefined;
        current = current[part];
    }
    return current;
}

/**
 * Replaces {{nodeId.path}} with actual data from context
 */

export async function resolveTemplate(template: string, context: Record<string, any>) {
    if (typeof template !== "string" || !template.includes("{{")) return template;

    // 1. Find all matches in the string
    const matches = Array.from(template.matchAll(TEMPLATE_REGEX));
    let resolvedString = template;

    for (const match of matches) {
        const fullMatch = match[0]; // {{Vault.MY_SECRET}} or {{nodeId.data}}
        const path = match[1];      // Vault.MY_SECRET or nodeId.data

        let resolvedValue: string | undefined;

        // 2. Handle Vault Logic
        if (path.startsWith("Vault.")) {
            const secretName = path.split(".").filter(Boolean)[1];
            try {
                // Call your async VaultService
                resolvedValue = await vaultService.resolve(secretName);

                console.log("Resolved vault value", resolvedValue);
            } catch (err) {
                console.error(`[Vault] Failed to resolve: ${secretName}`, err);
                resolvedValue = undefined;
            }
        }
        // 3. Handle Standard Context Logic
        else {
            const value = safePathLookup(context, path);
            resolvedValue = typeof value === "object" ? JSON.stringify(value) : String(value);
        }

        // 4. Perform the replacement
        if (resolvedValue !== undefined && resolvedValue !== "undefined") {
            resolvedString = resolvedString.replace(fullMatch, resolvedValue);
        } else {
            console.warn(`[Workflow] Could not resolve: ${path}`);
        }
    }

    return resolvedString;
}

/**
 * Recursively resolves all strings inside a node's configuration
 */
async function resolveConfig(config: NodeConfigType, context: Record<string, any>) {
    if (typeof config === "string") return await resolveTemplate(config, context);
    if (Array.isArray(config)) return config.map(async v => await resolveConfig(v, context));
    if (config && typeof config === "object") {
        const result = {};
        for (const key of Object.keys(config)) {
            result[key] = await resolveConfig(config[key], context);
        }
        return result;
    }
    console.log("resolved config:", config);
    return config;
}

export const nodeRegistry: any = {
    trigger: async ({ node }) => ({
        timestamp: new Date().toISOString(),
        type: node.config.triggerType || "manual"
    }),

    httpNode: async ({ node }) => {
        const { url, method, headers = {}, body } = node.config;

        // Ensure the body is a valid string if it was resolved from an object
        const finalBody = typeof body === 'object' ? JSON.stringify(body) : body;

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", ...headers },
            body: method !== "GET" ? finalBody : undefined
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return await res.json();
    },

    condition: async ({ node }) => {
        const { leftValue, operator, rightValue } = node.config;
        switch (operator) {
            case "==": return leftValue == rightValue;
            case "!=": return leftValue != rightValue;
            case ">":  return Number(leftValue) > Number(rightValue);
            case "<":  return Number(leftValue) < Number(rightValue);
            case "exists": return leftValue !== undefined && leftValue !== null;
            default: return false;
        }
    },

    transform: async ({ node, inputs }) => {
        const transformFn = new Function("inputs", node.config.code);
        return transformFn(inputs);
    },

    llmNode: async ({ node }) => {
        const {
            model,
            systemPrompt,
            userPrompt,
            temperature,
            apiKey
        } = node.config;

        // 1. Validation
        if (!apiKey || apiKey.includes("{{")) {
            throw new Error("Google LLM Error: API Key not resolved.");
        }

        const google = createGoogleGenerativeAI({
            apiKey: apiKey
        });

        // 3. Generate Text
        const { text, usage, finishReason } = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: userPrompt,
            system: systemPrompt,
            temperature: temperature,
        });

        console.log("Ai Response text: ", text);
        return {
            content: text,
            usage: {
                promptTokens: usage.inputTokens,
                completionTokens: usage.outputTokens,
                totalTokens: usage.totalTokens,
            },
            finishReason
        };
    }
};

export async function executeWorkflow(
    graph: WorkflowDefinition,
    dispatch: (action: WorkflowEditorAction) => void
) {
    const { nodes, edges } = graph;
    const context: Record<string, any> = {};
    const completed = new Set<string>();
    const running = new Set<string>();
    const validNodeIds = new Set(nodes.map(n => n.id));
    const incoming: Record<string, string[]> = {};
    const outgoing: Record<string, string[]> = {};

    for (const node of nodes) {
        incoming[node.id] = [];
        outgoing[node.id] = [];
    }

    edges.forEach(e => {
        if (validNodeIds.has(e.source) && validNodeIds.has(e.target)) {
            incoming[e.target].push(e.source);
            outgoing[e.source].push(e.target);
        } else {
            console.warn(`[Executor] Skipping orphaned edge: ${e.source} -> ${e.target}`);
        }
    });


    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

    async function runNode(nodeId: string) {
        if (completed.has(nodeId) || running.has(nodeId)) return;

        const node = nodeMap[nodeId];
        running.add(nodeId);

        const outgoingEdges = edges.filter(e => e.source === nodeId);

        dispatch({ type: WorkflowEditorActionType.NODE_EXECUTION_START, nodeId });

        // Start animation for all connected outgoing edges
        outgoingEdges.forEach(edge => {
            dispatch({ type: WorkflowEditorActionType.EDGE_EXECUTION_START, edgeId: edge.id });
        });

        try {
            // 1. Prepare inputs from parents (already in context)
            const nodeInputs = edges
                .filter(e => e.target === nodeId)
                .reduce((acc, e) => {
                    acc[e.sourceHandle || e.source] = context[e.source];
                    return acc;
                }, {} as any);

            console.table(context)
            // 2. CRITICAL: Resolve the config using the context built by previous nodes
            // We pass 'context' which now contains the outputs of all 'completed' nodes
            const resolvedConfig = await resolveConfig(node.config, context);

            const executor = nodeRegistry[node.type];
            if (!executor) throw new Error(`No executor found for type: ${node.type}`);

            // 3. Execute with the RESOLVED config
            // Note: We spread the node but overwrite config with the resolved one
            await new Promise(r => setTimeout( r, 1000));
            const output = await executor({
                node: { ...node, config: resolvedConfig },
                inputs: nodeInputs
            });

            // 4. Update Context
            // We store the output so the NEXT node can resolve its own {{nodeId...}} templates
            context[nodeId] = output;

            completed.add(nodeId);

            outgoingEdges.forEach(edge => {
                dispatch({ type: WorkflowEditorActionType.EDGE_EXECUTION_END, edgeId: edge.id });
            });

            dispatch({ type: WorkflowEditorActionType.NODE_EXECUTION_SUCCESS, nodeId, output });

            // 5. Determine branching for next nodes
            let nextNodeIds = outgoing[nodeId];
            if (node.type === "condition") {
                const branch = output ? "true" : "false";
                nextNodeIds = edges
                    .filter(e => e.source === nodeId && e.sourceHandle === branch)
                    .map(e => e.target);

                outgoingEdges.forEach(edge => {
                    dispatch({ type: WorkflowEditorActionType.EDGE_EXECUTION_END, edgeId: edge.id });
                });

                // Optionally: Re-start ONLY the successful branch edge to show the path taken
                const successfulEdge = edges.find(e => e.source === nodeId && e.sourceHandle === branch);
                if (successfulEdge) {
                    dispatch({ type: WorkflowEditorActionType.EDGE_EXECUTION_START, edgeId: successfulEdge.id });
                }
            }

            // 6. Trigger ready children
            const readyNodes = nextNodeIds.filter(id =>
                incoming[id].every((parentId: string) => completed.has(parentId))
            );

            await Promise.all(readyNodes.map(runNode));

        } catch (e: any) {
            console.log(e)
            dispatch({ type: WorkflowEditorActionType.NODE_EXECUTION_ERROR, nodeId, error: e.message });
        } finally {
            running.delete(nodeId);
            outgoingEdges.forEach(edge => {
                dispatch({ type: WorkflowEditorActionType.EDGE_EXECUTION_START, edgeId: edge.id });
            });
        }
    }

    // Start with nodes that have no parents
    const startNodes = nodes.filter(n => incoming[n.id].length === 0).map(n => n.id);
    await Promise.all(startNodes.map(runNode));

    return context;
}