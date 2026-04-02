import { createGoogleGenerativeAI } from "@ai-sdk/google";
import {generateText, Output} from "ai";
import {LLMNode, LLMNodeConfig} from "@neuron/shared";
import {z} from "zod";

export const llmNodeExecutor = async ({ node }: { node: LLMNode }) => {
    const {
        model,
        systemPrompt,
        userPrompt,
        temperature,
        apiKey,
        jsonMode,
        outputSchema
    } = node.config as LLMNodeConfig;

    if (!apiKey || apiKey.includes("{{")) {
        throw new Error("AI Execution Error: API Key resolution failed.");
    }

    const google = createGoogleGenerativeAI({ apiKey });

    const options: any = {
        model: google(model || 'gemini-1.5-flash'),
        prompt: userPrompt,
        system: systemPrompt,
        temperature: temperature,
    };

    if (jsonMode && outputSchema) {
        const dynamicZodSchema = parseZodSchema(outputSchema);

        options.output = Output.object({
            schema: dynamicZodSchema
        });
    }

    const { text, output, usage, finishReason } = await generateText(options);

    return {
        // Return the object if in JSON mode, otherwise fallback to text
        content: jsonMode ? output : text,
        usage: {
            promptTokens: usage.inputTokens,
            completionTokens: usage.outputTokens,
            totalTokens: usage.totalTokens,
        },
        finishReason
    };
}


/**
 * Converts a "Zod-style" string definition into a real Zod schema.
 * Handles: z.string(), z.number(), z.boolean(), z.array(), z.object(), and .describe()
 */
export function parseZodSchema(input: string): z.ZodTypeAny {
    // 1. Clean the input (remove 'z.' prefixes and whitespace for easier matching)
    // In a real scenario, you'd use a regex or a small library like 'nearley'
    // for a full parser, but this manual mapper is safest without eval.

    // For this implementation, we expect a standard object-style string:
    // "{ name: z.string(), age: z.number() }"

    try {
        // Step 1: Extract the content between the outer curly braces
        const objectBody = input.trim().replace(/^\{/, "").replace(/\}$/, "");

        // Step 2: Split by key-value pairs (using a basic comma split)
        const pairs = objectBody.split(/,(?![^()]*\))/); // Split by comma not inside parens

        const shape: Record<string, z.ZodTypeAny> = {};

        pairs.forEach(pair => {
            const [key, value] = pair.split(":").map(s => s.trim());
            if (!key || !value) return;

            shape[key] = mapTokenToZod(value);
        });

        return z.object(shape);
    } catch (e) {
        throw new Error("Failed to parse Zod schema. Please check your syntax.");
    }
}

function mapTokenToZod(token: string): z.ZodTypeAny {
    let schema: z.ZodTypeAny = z.string();

    // Basic Type Mapping
    if (token.includes("z.string()")) schema = z.string();
    if (token.includes("z.number()")) schema = z.number();
    if (token.includes("z.boolean()")) schema = z.boolean();

    // Recursive Array Mapping: z.array(z.string())
    if (token.includes("z.array(")) {
        const inner = token.match(/z\.array\((.*)\)/)?.[1] || "z.string()";
        schema = z.array(mapTokenToZod(inner));
    }

    // Modifier Mapping: .describe("...")
    if (token.includes(".describe(")) {
        const description = token.match(/\.describe\(['"](.*)['"]\)/)?.[1];
        if (description) schema = schema.describe(description);
    }

    // Modifier Mapping: .positive()
    if (token.includes(".positive()")) {
        if (schema instanceof z.ZodNumber) schema = schema.positive();
    }

    return schema;
}