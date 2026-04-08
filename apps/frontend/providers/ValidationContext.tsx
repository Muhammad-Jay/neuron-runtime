"use client";

import React, {createContext, useCallback, useMemo} from "react";
import {NodeMetaType, ValidationError} from "@neuron/shared";
import { nodeRegistry } from "@/registry/nodeRegistry";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import {debounce} from "lodash";

export interface WorkflowNodeError extends NodeMetaType  {
    errors: ValidationError[]
}

interface ValidationContextType {
    /** Map of Node IDs to their respective validation errors */
    errors: Record<string, WorkflowNodeError>;
    isValid: boolean;
    getNodeErrors: (nodeId: string) => WorkflowNodeError | null;
    isNodeValid: (nodeId: string) => boolean;
}

export const ValidationContext = createContext<ValidationContextType | undefined>(undefined);

export const ValidationProvider = ({ children }: { children: React.ReactNode }) => {
    const { editorState: { graph: { nodes: graphNodes }}} = useWorkflowEditor();

    // Memoize the array conversion of nodes
    const nodes = useMemo(() => Object.values(graphNodes), [graphNodes]);

    // Calculate the error record: O(N) where N is number of nodes
    const errors = useMemo(() => {
        const record: Record<string, WorkflowNodeError> = {};

        nodes.forEach(node => {
            const validator = nodeRegistry[node.type];
            if (validator) {
                const nodeErrors = validator.validate(node);
                if (nodeErrors && nodeErrors.length > 0) {
                    record[node.id] = {
                        meta: node.config.meta,
                        errors: nodeErrors,
                    };
                }
            }
        });

        return record;
    }, [nodes]);

    const isValid = useMemo(() => {
        return !Object.values(errors).flat().some(e => e.errors.some(l => l.level === "error"));
    }, [errors]);

    const getNodeErrors = useCallback((nodeId: string) => errors[nodeId] || null, [errors]);

    const isNodeValid = useCallback((nodeId: string) => {
        const nodeErrors = errors[nodeId];
        if (!nodeErrors) return true;
        return !nodeErrors.errors.some(e => e.level === "error");
    }, [errors]);

    const value = useMemo(() => ({
        errors,
        isValid,
        getNodeErrors,
        isNodeValid,
    }), [
        errors,
        isValid,
        getNodeErrors,
        isNodeValid
    ]);

    return (
        <ValidationContext.Provider value={value}>
            {children}
        </ValidationContext.Provider>
    );
};