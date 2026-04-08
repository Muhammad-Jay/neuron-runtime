export interface ValidationError {
    nodeId: string;
    field: string;
    message: string;
    level: "error" | "warning";
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}