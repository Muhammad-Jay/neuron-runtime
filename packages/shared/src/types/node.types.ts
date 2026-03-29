export type NodeExecutionStatus =
    | "idle"
    | "running"
    | "success"
    | "error";

export type NodeType =
    | "trigger"
    | "httpNode"
    | "debug"
    | "delay"
    | "condition"
    | "transform"
    | "llmNode"
    | "decisionNode"
    | "outputNode"
    | "respondNode"
    | "contextNode";

export type WorkflowNode =
    | TriggerNode
    | HttpRequestNode
    | DebugNode
    | ConditionNode
    | TransformNode
    | LLMNode
    | DecisionNode
    | OutputNode
    | RespondNode
    | ContextNode;


export interface BaseNode<TConfig = unknown> {
    id: string
    type: NodeType
    workflowId?: string
    config: TConfig
    position: {
        x: number,
        y: number,
    }
    createdAt?: string
    updatedAt?: string
}

export type PrimitiveType = "string" | "number" | "boolean";

export type SchemaField = {
    type: PrimitiveType | "object" | "array";
    children?: Record<string, SchemaField>; // for nested objects
    arrayItem?: SchemaField;                // for array types
};

export interface FieldInput {
    id: string;                            // unique id for react key
    name: string;
    type: PrimitiveType | "object" | "array";
    children?: FieldInput[];
    arrayItem?: FieldInput;
}

export type NodeConfigType =
    TriggerNodeConfig
    | HttpRequestNodeConfig
    | DebugNodeConfig
    | TransformNodeConfig
    | ConditionNodeConfig
    | LLMNodeConfig
    | DecisionNodeConfig
    | IntegrationNodeConfig
    | OutputNodeConfig
    | RespondNodeConfig
    | ContextNodeConfig;

export interface TriggerNodeConfig {
    triggerType: "manual" | "webhook" | "schedule",
    input?: any,
    output?: any,
    outputSchema?: any,
}

export type TriggerNode = BaseNode<TriggerNodeConfig> & {
    type: NodeType,
}

export interface HttpRequestNodeConfig {
    url: string
    method: "GET" | "POST" | "PUT" | "DELETE"
    headers?: Record<string, string>
    body?: Record<string, any>,
    input?: any,
    output?: any,
    outputSchema?: any,
}

export type HttpRequestNode = BaseNode<HttpRequestNodeConfig> & {
    type: NodeType
}

export interface DebugNodeConfig {
    message: string,
    input?: any,
    output?: any,
    outputSchema?: any,
}
export type DebugNode = BaseNode<DebugNodeConfig> & {
    type: NodeType
}

export interface ConditionNodeConfig {
    // Example: { "left": "{{httpNode_1.status}}", "op": "==", "right": "200" }
    leftValue: string;
    operator: "==" | "!=" | ">" | "<" | "contains" | "exists";
    rightValue: string;
    input?: any;
    output?: any; // Will store boolean result for debugging
    outputSchema?: any;
}

export type ConditionNode = BaseNode<ConditionNodeConfig> & {
    type: "condition";
};

// --- TRANSFORM NODE ---
export interface TransformNodeConfig {
    code: string;
    input?: any;
    output?: any;
    outputSchema?: any;
}

export type TransformNode = BaseNode<TransformNodeConfig> & {
    type: "transform";
};


export interface LLMNodeConfig {
    provider: string;
    model: string;            // e.g., "gpt-4o", "claude-3-5-sonnet"
    systemPrompt: string;     // The "persona" (can contain {{vars}})
    userPrompt: string;       // The actual instruction (can contain {{vars}})
    temperature: number;      // 0.0 to 1.0
    maxTokens: number;
    apiKey: string;           // Usually a reference like {{Vault.OPENAI_KEY}}
}


export type LLMNode = BaseNode<LLMNodeConfig> & {
    type: "llmNode";
}

// --- DECISION NODE ---
export interface DecisionRule {
    id: string;
    operator: "==" | "!=" | ">" | "<" | "includes" | "exists";
    value: string;
    transforms: string[];
    label: string;
}

export interface DecisionNodeConfig {
    input: string;            // The {{variable}} being evaluated
    inputTransforms: string[]; // Global transforms (e.g. ["trim", "toLowerCase"])
    rules: DecisionRule[];
    includeDefault: boolean,
    output?: any;
    outputSchema?: any;
}

export type DecisionNode = BaseNode<DecisionNodeConfig> & {
    type: "decisionNode";
};

// --- INTEGRATION NODE ---
export interface IntegrationNodeConfig {
    connectionId: string;    // Reference to a saved Connection
    integrationId: string;   // "slack", "whatsapp", "resend"
    resource: string;        // "message", "channel", "user"
    action: string;          // "send", "list", "delete"
    parameters: Record<string, any>; // The actual mapped fields (e.g. { text: "{{...}}" })
}

export type IntegrationNode = BaseNode<IntegrationNodeConfig> & {
    type: "integrationNode";
}


// --- OUTPUT NODE ---
export type OutputDeliveryMode =
    | "webhook_response"  // Returns immediately to the caller
    | "stored_result"     // Saves to the Lazarus execution logs
    | "notification";     // Pushes to a UI toast or internal alert

export type OutputFormatType =
    | "json"
    | "markdown"
    | "text"
    | "html"
    | "csv";

export interface OutputNodeConfig {
    // The visual title of this specific output (e.g., "Final Summary")
    label: string;

    // The raw content template supporting {{Global.VAR}} and {{nodeId.output}}
    template: string;

    // Professional formatting options
    format: {
        type: OutputFormatType;
        minify?: boolean;        // For JSON/HTML
        syntaxHighlight?: boolean; // For UI rendering in Jaguar
    };

    // How the data should be handled after execution
    delivery: {
        mode: OutputDeliveryMode;
        isPrimary: boolean;      // If true, this is the main result of the entire workflow
        statusCode?: number;     // Relevant if triggerType was 'webhook'
    };

    // Metadata for the Lazarus Engine
    includeMetadata: boolean;    // Includes execution time, tokens used, etc.
    output?: any;                // The final resolved string/object
    outputSchema?: SchemaField;  // For downstream type safety
}

export type OutputNode = BaseNode<OutputNodeConfig> & {
    type: "outputNode";
};


// --- RESPOND NODE ---
export interface RespondNodeConfig {
    // Allows static numbers (200) or dynamic lookup ("{{logic_1.code}}")
    statusCode: number | string;

    // Map of HTTP headers (e.g., { "Content-Type": "application/json" })
    headers: Record<string, string>;

    // The JSON payload. Supports nested objects and template strings.
    // Example: { "message": "Success", "data": "{{llmNode_1.output}}" }
    body: Record<string, any> | string;

    // Behavior flags for the Lazarus Execution Engine
    options: {
        minify: boolean;           // Strips whitespace from response
        includeTraceId: boolean;   // Appends Lazarus-Trace-ID for debugging
        errorOnEmpty: boolean;     // Throws workflow error if body is undefined
    };

    sourceNodeId?: string;

    // Metadata for the Jaguar UI and type-safety
    outputSchema?: SchemaField;
}

export type RespondNode = BaseNode<RespondNodeConfig> & {
    type: "respondNode";
};

// --- CONTEXT NODE ---
export interface ContextNodeConfig {
    label: string;

    fields: Record<string, any>;

    outputSchema?: SchemaField;
}

export type ContextNode = BaseNode<ContextNodeConfig> & {
    type: "contextNode";
};