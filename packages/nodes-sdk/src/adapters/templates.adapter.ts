import {
    ConditionNodeConfig,
    ContextNodeConfig,
    DebugNodeConfig,
    DecisionNodeConfig,
    HttpRequestNodeConfig,
    IntegrationNodeConfig,
    LLMNodeConfig,
    NodeConfigType,
    NodeType,
    OutputNodeConfig,
    RespondNodeConfig,
    TransformNodeConfig,
    TriggerNodeConfig,
} from '@neuron/shared';
import {
    Zap,
    Globe,
    Bug,
    Split,
    Code2,
    Sparkles,
    MessageSquare,
    FileJson,
    Send,
    Database,
    LucideIcon,
} from 'lucide-react';

export interface NodeTemplate {
    key: string;
    type: NodeType; // Changed from string to NodeType for strictness
    label: string;
    category: 'Logic' | 'Network' | 'AI' | 'Communication' | 'Data';
    description: string;
    icon: LucideIcon; // Added Icon property
    defaultConfig: NodeConfigType;
}

export const HTTP_METHODS = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
];

/**
 * Helper to generate default base settings for templates
 */
const getBaseConfig = (label: string) => ({
    meta: {
        label,
        description: '',
    },
    executionConfig: {
        retry: {
            enabled: false,
            maxAttempts: 3,
            delayMs: 1000,
            strategy: 'fixed' as const,
        },
        timeout: { enabled: true, durationMs: 30000 },
        errorHandling: { continueOnError: false },
    },
});

export const NODE_TEMPLATES: NodeTemplate[] = [
    {
        key: 'start',
        type: 'trigger',
        label: 'Trigger Node',
        category: 'Logic',
        icon: Zap,
        description: 'Entry point of the workflow',
        defaultConfig: {
            ...getBaseConfig('Trigger Initiation'),
            triggerType: 'manual',
        } as TriggerNodeConfig,
    },
    {
        key: 'http',
        type: 'httpNode',
        label: 'HTTPS Request',
        category: 'Network',
        icon: Globe,
        description: 'Make an external API request',
        defaultConfig: {
            ...getBaseConfig('External API Call'),
            url: '',
            method: 'GET',
            headers: {},
            body: {},
        } as HttpRequestNodeConfig,
    },
    {
        key: 'debug',
        type: 'debug',
        label: 'Debug Log',
        category: 'Network',
        icon: Bug,
        description: 'Log data to the execution console',
        defaultConfig: {
            ...getBaseConfig('Debug Console'),
            message: '',
        } as DebugNodeConfig,
    },
    {
        key: 'condition',
        type: 'condition',
        label: 'Condition',
        category: 'Logic',
        icon: Split,
        description: 'Branch the workflow based on logic',
        defaultConfig: {
            ...getBaseConfig('Boolean Logic'),
            leftValue: '',
            operator: '==',
            rightValue: '',
        } as ConditionNodeConfig,
    },
    {
        key: 'decision',
        type: 'decisionNode',
        label: 'Decision',
        category: 'Logic',
        icon: Split,
        description: 'Multi-path branching based on rules',
        defaultConfig: {
            ...getBaseConfig('Router'),
            input: '',
            includeDefault: true,
            inputTransforms: [],
            rules: [],
        } as DecisionNodeConfig,
    },
    {
        key: 'transform',
        type: 'transform',
        label: 'Transform',
        category: 'Logic',
        icon: Code2,
        description: 'Transform data using JavaScript',
        defaultConfig: {
            ...getBaseConfig('Data Mapping'),
            code: 'return inputs;',
        } as TransformNodeConfig,
    },
    {
        key: 'llm',
        type: 'llmNode',
        label: 'LLM Completion',
        category: 'AI',
        icon: Sparkles,
        description: 'Generate text using AI models',
        defaultConfig: {
            ...getBaseConfig('AI Inference'),
            provider: 'openai',
            model: 'gpt-4o',
            systemPrompt: 'You are a helpful assistant.',
            userPrompt: '',
            temperature: 0.7,
            apiKey: '',
            maxTokens: 1000,
            jsonMode: false,
            outputSchema: '',
        } as LLMNodeConfig,
    },
    {
        key: 'slack-send-message',
        type: 'integrationNode',
        label: 'Slack Message',
        category: 'Communication',
        icon: MessageSquare,
        description: 'Post a message to a Slack channel',
        defaultConfig: {
            ...getBaseConfig('Slack Notification'),
            connectionId: '',
            integrationId: 'slack',
            resource: 'chat',
            action: 'postMessage',
            parameters: { channel: '', text: '' },
        } as IntegrationNodeConfig,
    },
    {
        key: 'whatsapp-send-template',
        type: 'integrationNode',
        label: 'WhatsApp Template',
        category: 'Communication',
        icon: MessageSquare,
        description: 'Send a WhatsApp message via Meta',
        defaultConfig: {
            ...getBaseConfig('WhatsApp Outreach'),
            connectionId: '',
            integrationId: 'whatsapp',
            resource: 'messages',
            action: 'sendTemplate',
            parameters: { phoneNumber: '', templateName: '' },
        } as IntegrationNodeConfig,
    },
    {
        key: 'output',
        type: 'outputNode',
        label: 'Final Output',
        category: 'Logic',
        icon: FileJson,
        description: 'Configure the final data delivery',
        defaultConfig: {
            ...getBaseConfig('Workflow Result'),
            template: '{}',
            format: { type: 'json', minify: false },
            delivery: { mode: 'webhook_response', isPrimary: true, statusCode: 200 },
            includeMetadata: false,
        } as OutputNodeConfig,
    },
    {
        key: 'respond',
        type: 'respondNode',
        label: 'Network Response',
        category: 'Network',
        icon: Send,
        description: 'Send HTTP response and close connection',
        defaultConfig: {
            ...getBaseConfig('API Response'),
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {},
            attachContext: false,
            options: { minify: false, includeTraceId: true, errorOnEmpty: false },
        } as RespondNodeConfig,
    },
    {
        key: 'context',
        type: 'contextNode',
        label: 'Context',
        category: 'Data',
        icon: Database,
        description: 'Aggregate multiple node outputs',
        defaultConfig: {
            ...getBaseConfig('Variable Aggregator'),
            fields: {},
        } as ContextNodeConfig,
    },
];


export function getTemplatesFromShared() {
    return NODE_TEMPLATES;
}