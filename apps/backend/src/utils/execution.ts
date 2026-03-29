import type {ExecutionStatus} from "../types/types.js";

export function isFinalStatus(status: ExecutionStatus): boolean {
    return status === "success" || status === "failed"
}

export function isRunning(status: ExecutionStatus): boolean {
    return status === "running"
}

export function validateAgainstSchema(payload: any, schema: any) {
    // Logic: Iterate through outputSchema.fields and check if payload keys exist/match types
    // If mismatch found, throw error to be caught by the engine's error handler
    schema.fields.forEach((field: any) => {
        if (field.required && payload[field.key] === undefined) {
            throw new Error(`Schema Violation: Missing required field '${field.key}'`);
        }
    });
}

export function getContentType(format: string) {
    const types: Record<string, string> = {
        json: "application/json",
        markdown: "text/markdown",
        html: "text/html",
        text: "text/plain"
    };
    return types[format] || "text/plain";
}