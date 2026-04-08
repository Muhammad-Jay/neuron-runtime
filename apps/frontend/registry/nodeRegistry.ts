// types/validation.ts
import {
    NodeType,
    HttpRequestNodeConfig,
    LLMNodeConfig,
    ValidationError, TriggerNode, HttpRequestNode, LLMNode
} from "@neuron/shared";
import {ValidationFunction} from "@/types/validation";

export const nodeRegistry: Record<NodeType, { validate: ValidationFunction }> = {
    trigger: {
        validate: (node: TriggerNode) => {
            const errors: ValidationError[] = [];
            if (!node.config.triggerType) {
                errors.push({ nodeId: node.id, field: "triggerType", message: "Trigger type is required", level: "error" });
            }
            return errors;
        }
    },
    httpNode: {
        validate: (node: HttpRequestNode) => {
            const errors: ValidationError[] = [];
            const config = node.config as HttpRequestNodeConfig;
            if (!config.url) {
                errors.push({ nodeId: node.id, field: "url", message: "URL endpoint is missing", level: "error" });
            } else if (!config.url.startsWith("http")) {
                // errors.push({ nodeId: node.id, field: "url", message: "Invalid URL protocol", level: "error" });
            }
            return errors;
        }
    },
    llmNode: {
        validate: (node: LLMNode) => {
            const errors: ValidationError[] = [];
            const config = node.config as LLMNodeConfig;
            if (!config.userPrompt) {
                errors.push({ nodeId: node.id, field: "userPrompt", message: "Prompt cannot be empty", level: "error" });
            }
            if (config.jsonMode && !config.outputSchema){
                errors.push({ nodeId: node.id, field: "outputSchema", message: "Output schema is required", level: "warning" });
            }
            if (!config.apiKey) { // Example check
                errors.push({ nodeId: node.id, field: "apiKey", message: "API Key required for this provider", level: "error" });
            }
            return errors;
        }
    },
    // Add default empty validators for others to prevent crashes
    debug: { validate: () => [] },
    delay: { validate: () => [] },
    condition: { validate: () => [] },
    transform: { validate: () => [] },
    decisionNode: { validate: () => [] },
    outputNode: { validate: () => [] },
    respondNode: { validate: () => [] },
    contextNode: { validate: () => [] },
    integrationNode: { validate: () => [] },
};