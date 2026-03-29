"use client";

import { Node } from "reactflow";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { useEffect, useState } from "react";
import { ConditionNodeConfig } from "../../../../../shared/src/types/node.types";
import FormField from "@/components/FormField";
import {getAvailableUpstreamNodes, getPreviousNode} from "@/lib/utils";
import {TemplateTextarea} from "@/components/workflow/editor/TemplateTextarea";

const OPERATORS = [
    { label: "Is Equal To (==)", value: "==" },
    { label: "Is Not Equal To (!=)", value: "!=" },
    { label: "Greater Than (>)", value: ">" },
    { label: "Less Than (<)", value: "<" },
    { label: "Contains", value: "contains" },
    { label: "Exists / Not Null", value: "exists" },
];

export function ConditionNodeConfigSheet({
                                             node,
                                             open,
                                             onOpen
                                         }: {
    node: Node,
    open: boolean,
    onOpen?: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    // 1. Initialize local state from node data
    const [config, setConfig] = useState<ConditionNodeConfig>({
        leftValue: node.data.config?.leftValue || "",
        operator: node.data.config?.operator || "==",
        rightValue: node.data.config?.rightValue || "",
    });

    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // 2. Debounced sync to the global workflow state
    useEffect(() => {
        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const handleChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            title="Condition Logic"
        >
            <div className="space-y-6 mt-6">
                <div className="p-3 rounded-lg bg-neutral-900/40 border border-neutral-800/50 backdrop-blur-sm">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight mb-3">
                        Logic Rule
                    </p>

                    <div className="space-y-4">
                        {/* LEFT VALUE */}
                        <TemplateTextarea
                            label="Variable / Left Value"
                            value={config.leftValue}
                            variables={availableVariables}
                            onChange={(val) => {
                                handleChange("leftValue", val)
                            }}
                            placeholder="{{httpNode_1.status}}"
                        />

                        {/* OPERATOR */}
                        <FormField
                            label="Operator"
                            type="select"
                            path="operator"
                            className="grid-cols-1 space-y-1"
                            value={config.operator}
                            onChange={handleChange}
                            options={OPERATORS}
                        />

                        {/* RIGHT VALUE */}
                        {config.operator !== "exists" && (
                            <TemplateTextarea
                                label="Comparison / Right Value"
                                variables={availableVariables}
                                value={config.rightValue}
                                onChange={(val) => {
                                    handleChange("rightValue", val)
                                }}
                                placeholder="200"
                            />

                        )}
                    </div>
                </div>

                <div className="px-1">
                    <p className="text-[11px] text-neutral-400 italic">
                        Tip: Use double curly braces <code className="text-primary/80">{"{{ }}"}</code> to reference data from upstream nodes.
                    </p>
                </div>
            </div>
        </SheetWrapper>
    );
}