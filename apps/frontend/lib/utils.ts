import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
    GlobalVariable,
    IGlobalVariablesDefinition,
    NewWorkflowType,
    WorkflowDefinition,
    WorkflowTableSchemaType,
    WorkflowType
} from "@neuron/shared";
import type {FieldInput, NodeExecutionStatus, NodeType, SchemaField, WorkflowNode} from "@neuron/shared";
import {Edge, Node, NodeProps} from "reactflow";
import type {WorkflowEdge} from "@neuron/shared";
import crypto from "crypto"
import {VaultPayload} from "@/features/workflows/vaultService";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSupabaseEnvironmentVariables()
{
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

    if (supabaseUrl === null || supabaseUrl === undefined || supabasePublishableKey === null || supabasePublishableKey === undefined || supabaseAnonKey === null || supabaseAnonKey === undefined)
    {
        throw new Error(`Missing environment variable.`);
    }else {
        return ({
            supabaseUrl,
            supabaseAnonKey,
            supabasePublishableKey,
        })
    }
}

export function getBackendEndpoint(): string{
    return process.env.BACKEND_ENDPOINT ?? "http://localhost:5000/api/v1";
}

export function convertFieldInputToSchema(fields: FieldInput[]): Record<string, SchemaField> {
    const schema: Record<string, SchemaField> = {};

    fields.forEach(field => {
        if (field.type === "object") {
            schema[field.name] = {
                type: "object",
                children: field.children ? convertFieldInputToSchema(field.children) : {},
            };
        } else if (field.type === "array") {
            schema[field.name] = {
                type: "array",
                arrayItem: field.arrayItem
                    ? field.arrayItem.type === "object"
                        ? { type: "object", children: convertFieldInputToSchema(field.arrayItem.children || []) }
                        : { type: field.arrayItem.type }
                    : { type: "string" },
            };
        } else {
            schema[field.name] = { type: field.type };
        }
    });

    return schema;
}

export function toWorkflowTableSchema(workflow: NewWorkflowType): WorkflowTableSchemaType{

    return ({
        name: workflow.name,
        description: workflow.description,
        isActive: workflow.isActive,
        runs: workflow.runs,
        userId: workflow.userId,
        status: workflow.status,
    })
}

export function toReactFlowNode(node: WorkflowNode) {
    return {
        id: node.id,
        position: {
            x: node.position.x,
            y: node.position.y,
        },
        type: node.type,
        data: node.config
    }
}

export function toGraphNode(node: NodeProps): WorkflowNode {
    return {
        id: node.id,
        type: node.type as NodeType,
        position: {
            x: node.xPos,
            y: node.yPos,
        },
        config: node.data
    }
}

export function nodePropsToReactflowNode(node: NodeProps){
    return ({
        id: node.id,
        type: node.type,
        position: {x: node.xPos, y: node.yPos},
        selected: true,
        data: node.data
    })
}

export function getNodeStatusStyles(status?: NodeExecutionStatus) {
    switch (status) {
        case "running":
            return "border-neutral-400!  ring-2 ring-neutral-400 bg-neutral-500/20 shadow-[0_0_12px_rgba(200,200,200,0.25)]";

        case "success":
            return "border-neutral-500!  ring-2 ring-green-500! bg-green-500/0.5 shadow-[0_0_10px_rgba(220,220,220,0.25)]";

        case "error":
            return "border-red-500!  ring-2 ring-red-500! bg-red-500/0.5 shadow-[0_0_12px_rgba(255,0,0,0.25)]";

        case "idle":
            return "border-0  ring-0"
        default:
            return "border-transparent!";
    }
}

export const getPreviousNode = (nodeId: string, nodes: WorkflowNode[], edges: WorkflowEdge[]): WorkflowNode => {
    // 1. Find the edge where the current node is the target
    const incomingEdge = edges.find((edge) => edge.target === nodeId);

    if (!incomingEdge) return null;

    // 2. Return the node object that matches the source of that edge
    return nodes.find((node) => node.id === incomingEdge.source);
};


export const getNodeColor = (type: NodeType | string) => {
    const colors: Record<string, { border: string; bg: string; text: string; primary: string }> = {
        trigger: {
            border: "border-emerald-500/50",
            bg: "bg-emerald-500/5",
            text: "text-emerald-400",
            primary: "#10b981", // emerald-500
        },
        httpNode: {
            border: "border-blue-500/50",
            bg: "bg-blue-500/5",
            text: "text-blue-400",
            primary: "#3b82f6", // blue-500
        },
        condition: {
            border: "border-amber-500/50",
            bg: "bg-amber-500/5",
            text: "text-amber-400",
            primary: "#f59e0b", // amber-500
        },
        transform: {
            border: "border-purple-500/50",
            bg: "bg-purple-500/5",
            text: "text-purple-400",
            primary: "#a855f7", // purple-500
        },
        delay: {
            border: "border-slate-500/50",
            bg: "bg-slate-500/5",
            text: "text-slate-400",
            primary: "#64748b", // slate-500
        },
        debug: {
            border: "border-rose-500/50",
            bg: "bg-rose-500/5",
            text: "text-rose-400",
            primary: "#f43f5e", // rose-500
        },
    };

    // Fallback for unknown node types
    return colors[type] || {
        border: "border-neutral-700",
        bg: "bg-neutral-800/50",
        text: "text-neutral-400",
        primary: "#525252",
    };
};

export function getVariableQuery(text: string, cursor: number) {
    const before = text.slice(0, cursor)
    const match = before.match(/{{([\w.]*)$/)

    if (!match) return null

    return {
        query: match[1],
        startIndex: match.index!
    }
}

export function insertVariable(
    text: string,
    cursor: number,
    startIndex: number,
    variable: string
) {
    const before = text.slice(0, startIndex)
    const after = text.slice(cursor)

    return before + `{{${variable}}}` + after
}


const algorithm = "aes-256-gcm";

// Helper to get key safely at runtime, not at module evaluation
function getVaultKey(): Buffer {
    const secret = process.env.VAULT_SECRET ?? "9e6cc1953e576e2d687083223d49fba1b1e11dbfb1d1629f8d4f7c7800859ef9";
    if (!secret) {
        throw new Error("CRITICAL: VAULT_SECRET environment variable is missing.");
    }
    // We hash it to ensure it is exactly 32 bytes for AES-256
    return crypto.createHash("sha256").update(secret).digest();
}

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);
    const key = getVaultKey();
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final()
    ]);

    return {
        content: encrypted.toString("hex"),
        iv: iv.toString("hex"),
        tag: cipher.getAuthTag().toString("hex")
    };
}

export function decrypt(payload: VaultPayload) {
    if (!payload || !payload.content || !payload.iv || !payload.tag) {
        console.error("[Crypto] Malformed decryption payload:", payload);
        throw new Error("Decryption failed: Missing content, iv, or tag.");
    }

    const key = getVaultKey();
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(payload.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(payload.tag, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(payload.content, "hex")),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}


export function getAvailableUpstreamNodes(targetNodeId: string, graph: WorkflowDefinition) {
    const { nodes, edges } = graph;
    const incomingMap: Record<string, string[]> = {};

    // 1. Build the mapping of who points to whom
    edges.forEach(edge => {
        if (!incomingMap[edge.target]) incomingMap[edge.target] = [];
        incomingMap[edge.target].push(edge.source);
    });

    const ancestors = new Set<string>();
    const queue = [...(incomingMap[targetNodeId] || [])];

    // 2. Walk backwards through the graph
    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (!ancestors.has(currentId)) {
            ancestors.add(currentId);
            const parents = incomingMap[currentId] || [];
            queue.push(...parents);
        }
    }

    // 3. Return the actual node objects (for the label/name in the dropdown)
    return nodes.filter(node => ancestors.has(node.id));
}


export function arrayToGlobalVariables(variables: GlobalVariable[]): IGlobalVariablesDefinition {
    const incomingMap: IGlobalVariablesDefinition = {};

    for (const variable of variables) {
        incomingMap[variable.key] = variable
    }

    return incomingMap;
}

export function globalVariablesToArray(variables: IGlobalVariablesDefinition): GlobalVariable[] {
    return Object.entries(variables).map(([key, value]) => value)
}