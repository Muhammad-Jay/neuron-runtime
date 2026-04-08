/**
 * CORE TYPE DEFINITIONS
 */

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
    | "contextNode"
    | "integrationNode";

// --- SHARED BASE STRUCTURES ---
export type NodeMetaType = {
    meta: {
        label: string;
        description?: string;
    }
}

export interface ContextRegistrationSettings {
    persistToContext?: boolean;
    contextNodeId?: string; // Which context node to target
    alias?: string;         // How the data appears in the context (e.g., "userData")
}

export type NodeExecutionConfig = {
    retry?: {
        enabled: boolean;
        maxAttempts: number;     // total attempts (including first)
        delayMs: number;         // base delay
        strategy?: "fixed" | "exponential";
    };
    timeout?: {
        enabled: boolean;
        durationMs: number;
    };
    errorHandling?: {
        continueOnError: boolean;   // don't break workflow
        fallbackNodeId?: string;    // optional redirect
    };
    async?: {
        enabled: boolean;           // run in background
        detach?: boolean;           // don't wait at all
    };
    cache?: {
        enabled: boolean;
        ttlMs: number;
        key?: string;               // override cache key
    };
    rateLimit?: {
        enabled: boolean;
        maxPerSecond: number;
    };
    concurrency?: {
        limit: number;              // parallel executions allowed
    };
    logging?: {
        enabled: boolean;
        level?: "minimal" | "verbose";
    };
};

/**
 * The Master Configuration Base.
 */
export interface BaseNodeConfig extends ContextRegistrationSettings, NodeMetaType {
    input?: any;
    output?: any;
    outputSchema?: "";
    executionConfig?: NodeExecutionConfig; // Unified execution settings
}

export interface BaseNode<TConfig = BaseNodeConfig> {
    id: string;
    type: NodeType;
    workflowId?: string;
    config: TConfig;
    position: {
        x: number;
        y: number;
    };
    createdAt?: string;
    updatedAt?: string;
}

// --- DATA TYPES & SCHEMAS ---

export type PrimitiveType = "string" | "number" | "boolean";

export type SchemaField = {
    type: PrimitiveType | "object" | "array";
    children?: Record<string, SchemaField>;
    arrayItem?: SchemaField;
};

export interface FieldInput {
    id: string;
    name: string;
    type: PrimitiveType | "object" | "array";
    children?: FieldInput[];
    arrayItem?: FieldInput;
}

// --- SPECIFIC NODE CONFIGURATIONS ---

export interface TriggerNodeConfig extends BaseNodeConfig {
    triggerType: "manual" | "webhook" | "schedule";
}

export interface HttpRequestNodeConfig extends BaseNodeConfig {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: Record<string, any>;
}

export interface DebugNodeConfig extends BaseNodeConfig {
    message: string;
}

export interface ConditionNodeConfig extends BaseNodeConfig {
    leftValue: string;
    operator: "==" | "!=" | ">" | "<" | "contains" | "exists";
    rightValue: string;
}

export interface TransformNodeConfig extends BaseNodeConfig {
    code: string;
}

export interface LLMNodeConfig extends BaseNodeConfig {
    provider: string;
    model: string;
    systemPrompt: string;
    userPrompt: string;
    temperature: number;
    maxTokens: number;
    apiKey: string;
    jsonMode: boolean;
}

export interface DecisionRule {
    id: string;
    operator: "==" | "!=" | ">" | "<" | "includes" | "exists";
    value: string;
    transforms: string[];
    label: string;
}

export interface DecisionNodeConfig extends BaseNodeConfig {
    input: string;
    inputTransforms: string[];
    rules: DecisionRule[];
    includeDefault: boolean;
}

export interface IntegrationNodeConfig extends BaseNodeConfig {
    connectionId: string;
    integrationId: string;
    resource: string;
    action: string;
    parameters: Record<string, any>;
}

export type OutputDeliveryMode = "webhook_response" | "stored_result" | "notification";
export type OutputFormatType = "json" | "markdown" | "text" | "html" | "csv";

export interface OutputNodeConfig extends BaseNodeConfig {
    label: string;
    template: string;
    format: {
        type: OutputFormatType;
        minify?: boolean;
        syntaxHighlight?: boolean;
    };
    delivery: {
        mode: OutputDeliveryMode;
        isPrimary: boolean;
        statusCode?: number;
    };
    includeMetadata: boolean;
}

export interface RespondNodeConfig extends BaseNodeConfig {
    statusCode: number | string;
    headers: Record<string, string>;
    body: Record<string, any> | string;
    options: {
        minify: boolean;
        includeTraceId: boolean;
        errorOnEmpty: boolean;
    };
    sourceNodeId?: string;
    attachContext: boolean;
}

export interface ContextNodeConfig extends BaseNodeConfig {
    label: string;
    fields: Record<string, any>;
}

// --- NODE WRAPPERS & UNIONS ---

export type TriggerNode = BaseNode<TriggerNodeConfig>;
export type HttpRequestNode = BaseNode<HttpRequestNodeConfig>;
export type DebugNode = BaseNode<DebugNodeConfig>;
export type ConditionNode = BaseNode<ConditionNodeConfig>;
export type TransformNode = BaseNode<TransformNodeConfig>;
export type LLMNode = BaseNode<LLMNodeConfig>;
export type DecisionNode = BaseNode<DecisionNodeConfig>;
export type IntegrationNode = BaseNode<IntegrationNodeConfig>;
export type OutputNode = BaseNode<OutputNodeConfig>;
export type RespondNode = BaseNode<RespondNodeConfig>;
export type ContextNode = BaseNode<ContextNodeConfig>;

export type WorkflowNode =
    | TriggerNode
    | HttpRequestNode
    | DebugNode
    | ConditionNode
    | TransformNode
    | LLMNode
    | DecisionNode
    | IntegrationNode
    | OutputNode
    | RespondNode
    | ContextNode;

export type NodeConfigType =
    | TriggerNodeConfig
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