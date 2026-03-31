import type {NodeConfigType} from "@neuron/shared";
// @/constants/integrations-hub.ts
import {
    Slack,
    Github,
    Mail,
    MessageSquare,
    Database,
    Calendar,
    BarChart3,
    Infinity,
    Workflow,
    Cpu,
    Layers,
    Terminal,
    GitBranch,
    Share2, Zap, Brain, Shield, GitMerge, Activity
} from "lucide-react";
import {SectionType} from "@/components/layout/hero/HeroSection";

export type AuthMethod = "oauth" | "apikey";

export interface IntegrationPlatform {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    category: "Communication" | "DevTools" | "Productivity" | "Data";
    authMethod: AuthMethod;
    color: string;
}

export const SUPPORTED_PLATFORMS: IntegrationPlatform[] = [
    { id: "slack", name: "Slack", description: "Post messages, alerts, and manage channels.", icon: Slack, category: "Communication", authMethod: "oauth", color: "#4A154B" },
    { id: "whatsapp", name: "WhatsApp", description: "Send automated template messages via Meta.", icon: MessageSquare, category: "Communication", authMethod: "apikey", color: "#25D366" },
    { id: "github", name: "GitHub", description: "Trigger workflows on commits or PRs.", icon: Github, category: "DevTools", authMethod: "oauth", color: "#181717" },
    { id: "asana", name: "Asana", description: "Sync tasks and track project progress.", icon: Infinity, category: "Productivity", authMethod: "oauth", color: "#F06595" },
    { id: "jira", name: "Jira", description: "Manage issues and agile development.", icon: BarChart3, category: "Productivity", authMethod: "oauth", color: "#0052CC" },
    { id: "google", name: "Google Drive", description: "Access files and cloud storage.", icon: Database, category: "Data", authMethod: "oauth", color: "#4285F4" },
];

export const WorkflowCategory = {
    aiAgentWorkflow: "Ai Agent Workflow",
    automationWorkflow: "Automation Workflow",
    hybridWorkflow: "Hybrid Workflow",
    custom: "Custom",
}

export enum WorkflowActionType {
    SET_WORKFLOWS= "SET_WORKFLOWS",
    ADD_WORKFLOW = "ADD_WORKFLOW",
    DELETE_WORKFLOW = "DELETE_WORKFLOW",
    UPDATE_WORKFLOW = "UPDATE_WORKFLOW",
    UPDATE_STATUS = "UPDATE_STATUS",
}

export enum WorkflowEditorActionType {
    SET_WORKFLOW_ID = "SET_WORKFLOW_ID",
    SET_GRAPH = "SET_GRAPH",
    ADD_NODE = "ADD_NODE",
    ADD_EDGE = "ADD_EDGE",
    UPDATE_NODE = "UPDATE_NODE",
    UPDATE_EDGE = "UPDATE_EDGE",
    UPDATE_NODE_POSITION = "UPDATE_NODE_POSITION",
    DELETE_NODE = "DELETE_NODE",
    DELETE_EDGE = "DELETE_EDGE",

    UPDATE_DIRTY_STATE = "UPDATE_DIRTY_STATE",

    UPDATE_WORKFLOW = "UPDATE_WORKFLOW",
    UPDATE_STATUS = "UPDATE_STATUS",

    NODE_EXECUTION_START = "NODE_EXECUTION_START",
    NODE_EXECUTION_SUCCESS = "NODE_EXECUTION_SUCCESS",
    NODE_EXECUTION_ERROR = "NODE_EXECUTION_ERROR",
    RESET_NODE_STATUS = "RESET_NODE_STATUS",

    EDGE_EXECUTION_START = "EDGE_EXECUTION_START",
    EDGE_EXECUTION_END = "EDGE_EXECUTION_END",

    UPDATE_GLOBAL_VARS = "UPDATE_GLOBAL_VARS",

    SET_DEPLOYMENT = "SET_DEPLOYMENT",
    UPDATE_DEPLOYMENT = "UPDATE_DEPLOYMENT",
}

export interface NodeTemplate {
    key: string;
    type: string;
    label: string;
    category: string;
    description: string;
    defaultConfig: NodeConfigType;
}

export const NODE_TEMPLATES: NodeTemplate[] = [
    {
        key: "start",
        type: "trigger",
        label: "Trigger Node",
        category: "Logic",
        description: "Entry point of the workflow",
        defaultConfig: {
            triggerType: "schedule",
        },
    },
    {
        key: "http",
        type: "httpNode",
        label: "HTTPS Request",
        category: "Network",
        description: "Make an external API request",
        defaultConfig: {
            url: "",
            method: "GET",
            headers: {},
            body: {}
        },
    },
    {
        key: "debug",
        type: "debug",
        label: "Debug",
        category: "Network",
        description: "Branch based on logic",
        defaultConfig: {
            message: "",
        },
    },
    {
        key: "condition",
        type: "condition",
        label: "Condition",
        category: "Logic",
        description: "Branch the workflow based on logic",
        defaultConfig: {
            leftValue: "",
            operator: "==",
            rightValue: "",
        },
    },
    {
        key: "decision",
        type: "decisionNode", // Ensure this matches your React Flow node type
        label: "Decision",
        category: "Logic",
        description: "Branch the workflow into multiple paths based on rules",
        defaultConfig: {
            input: "", // The global source (supports {{vars}})
            includeDefault: true,
            inputTransforms: [],  // Array of transforms: e.g., ['trim', 'toLowerCase']
            rules: [
                {
                    id: crypto.randomUUID(),
                    operator: "==",
                    value: "",
                    transforms: [],
                    label: "Case 1"
                }
            ],
        },
    },
    {
        key: "transform",
        type: "transform",
        label: "Transform",
        category: "Logic",
        description: "Transform data using JavaScript",
        defaultConfig: {
            code: "return inputs;",
        },
    },
    {
        key: "llm",
        type: "llmNode",
        label: "LLM Completion",
        category: "AI",
        description: "Generate text using AI models (GPT, Claude, Gemini)",
        defaultConfig: {
            provider: "openai",
            model: "gpt-4o",
            systemPrompt: "You are a helpful assistant.",
            userPrompt: "",
            temperature: 0.7,
            apiKey: "",
            maxTokens: 1000,
        },
    },

    {
        key: "slack-send-message",
        type: "integrationNode", // The engine still sees this as an integration
        label: "Slack: Send Message",
        category: "Communication",
        description: "Post a message to a Slack channel or DM.",
        defaultConfig: {
            connectionId: "",
            integrationId: "slack",
            resource: "chat",
            action: "postMessage",
            parameters: {
                channel: "",
                text: "Hello from Lazarus! {{inputs.previous_node.data}}"
            }
        }
    },
    {
        key: "whatsapp-send-template",
        type: "integrationNode",
        label: "WhatsApp: Send Template",
        category: "Communication",
        description: "Send an automated WhatsApp message via Meta API.",
        defaultConfig: {
            connectionId: "",
            integrationId: "whatsapp",
            resource: "messages",
            action: "sendTemplate",
            parameters: {
                phoneNumber: "",
                templateName: ""
            }
        }
    },

    {
        key: "output",
        type: "outputNode",
        label: "Final Output",
        category: "Logic", // Or "Terminal" if you want to create a new group
        description: "Configure the final data delivery and response format.",
        defaultConfig: {
            label: "Workflow Result",
            template: "{\n  \"status\": \"success\",\n  \"timestamp\": \"{{system.now}}\",\n  \"data\": {{last_node.output}}\n}",
            format: {
                type: "json",
                minify: false,
            },
            delivery: {
                mode: "webhook_response",
                isPrimary: true,
                statusCode: 200,
            },
            includeMetadata: false,
        },
    },

    {
        key: "respond",
        type: "respondNode",
        label: "Network Response",
        category: "Network",
        description: "Send the final HTTP response back to the client and close the connection.",
        defaultConfig: {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "X-Powered-By": "Lazarus-Engine"
            },
            body: {
                success: true,
                message: "Workflow executed successfully",
                data: ""
            },
            sourceNodeId: "",
            attachContext: false,
            options: {
                minify: false,
                includeTraceId: true,
                errorOnEmpty: false,
            }
        },
    },

    {
        key: "context",
        type: "contextNode",
        label: "Aggregate Context",
        category: "Data",
        description: "Map multiple node outputs into a single structured object.",
        defaultConfig: {
            label: "Final Payload",
            fields: {
                "status": "success",
                "result": "{{last_node.output}}"
            },
        },
    },
];

export const HTTP_METHODS = [
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" }
]


export interface IntegrationAction {
    id: string;
    label: string;
    description: string;
    fields: {
        id: string;
        label: string;
        type: "string" | "textarea" | "select";
        placeholder?: string;
        options?: { label: string; value: string }[];
    }[];
}

export const INTEGRATION_MANIFEST: Record<string, { label: string; actions: IntegrationAction[] }> = {
    slack: {
        label: "Slack",
        actions: [
            {
                id: "postMessage",
                label: "Send Message",
                description: "Post a message to a specific channel.",
                fields: [
                    { id: "channel", label: "Channel ID", type: "string", placeholder: "C12345678" },
                    { id: "text", label: "Message Text", type: "textarea", placeholder: "Hello from Jaguar!" },
                ],
            },
        ],
    },
    whatsapp: {
        label: "WhatsApp",
        actions: [
            {
                id: "sendTemplate",
                label: "Send Template Message",
                description: "Send an approved WhatsApp template.",
                fields: [
                    { id: "phoneNumber", label: "Recipient Phone", type: "string", placeholder: "234..." },
                    { id: "templateName", label: "Template Name", type: "string" },
                ],
            },
        ],
    },
};

export const NEURON_PILLARS = [
    {
        title: "Logical Mesh",
        icon: Share2,
        desc: "A unified communication fabric that bridges fragmented APIs into a single, type-safe execution stream. No more glue code.",
        color: "#6366f1", // Indigo
        gridClass: "md:col-span-2",
        delay: 0.1
    },
    {
        title: "Edge Runtime",
        icon: Zap,
        desc: "Low-latency units designed for high-precision payloads at the source.",
        color: "#10b981", // Emerald
        gridClass: "md:col-span-1",
        delay: 0.2
    },
    {
        title: "Intent Analysis",
        icon: Brain,
        desc: "Translating natural language intent into executable system commands in real-time.",
        color: "#a855f7", // Purple
        gridClass: "md:col-span-1",
        delay: 0.3
    },
    {
        title: "Secure Sandbox",
        icon: Shield,
        desc: "Isolated execution environments for third-party integrations, keeping your core kernel untouchable and resilient.",
        color: "#ef4444", // Rose
        gridClass: "md:col-span-2",
        delay: 0.4
    }
];


export type FloatingItem = {
    title: string;
    icon: any;
    desc: string;
    side: "left" | "right";
};

export const DATA: Record<SectionType, FloatingItem[]> = {
    intro: [],
    any: [],
    features: [
        {
            title: "Execution Engine",
            icon: Cpu,
            side: "left",
            desc: "High-performance runtime built for executing node-based workflows with deterministic state handling and asynchronous task coordination."
        },
        {
            title: "Integration Layer",
            icon: Workflow,
            side: "right",
            desc: "Abstracted interface for connecting external APIs, services, and webhooks into a unified execution pipeline."
        },
        {
            title: "State Manager",
            icon: Layers,
            side: "left",
            desc: "Maintains data consistency across nodes, ensuring reliable propagation of inputs, outputs, and intermediate transformations."
        },
        {
            title: "Secure Connections",
            icon: Terminal,
            side: "right",
            desc: "Handles credential isolation and authentication flows for third-party services with strict access boundaries."
        }
    ],

    capabilities: [
        {
            title: "Real-Time Execution",
            icon: Activity,
            side: "left",
            desc: "Event-driven processing engine capable of executing workflows instantly with full visibility into each step."
        },
        {
            title: "Conditional Routing",
            icon: GitBranch,
            side: "right",
            desc: "Dynamic branching logic that adapts execution paths based on runtime data and evaluation results."
        },
        {
            title: "Context Propagation",
            icon: Cpu,
            side: "left",
            desc: "Ensures every node operates with accurate upstream data through structured context resolution."
        },
        {
            title: "Composable Pipelines",
            icon: Workflow,
            side: "right",
            desc: "Build modular workflows by chaining nodes into reusable, scalable execution pipelines."
        }
    ],

    demos: [
        {
            title: "Content Generation Flow",
            icon: Layers,
            side: "left",
            desc: "Automates blog creation by combining LLM nodes, external data sources, and transformation steps into a single pipeline."
        },
        {
            title: "API Orchestration",
            icon: Terminal,
            side: "right",
            desc: "Coordinates multiple API calls, handles responses, and transforms data across services in real-time."
        },
        {
            title: "Decision Automation",
            icon: GitBranch,
            side: "left",
            desc: "Implements logic-driven workflows that evaluate conditions and route execution intelligently."
        },
        {
            title: "Hybrid AI Workflows",
            icon: Activity,
            side: "right",
            desc: "Combines deterministic logic with LLM-based reasoning for advanced automation scenarios."
        }
    ]
};