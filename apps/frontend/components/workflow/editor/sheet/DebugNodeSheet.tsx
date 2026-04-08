"use client";

import React, { memo, useEffect, useState } from "react";
import { Node } from "reactflow";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { DebugNodeConfig } from "@neuron/shared";

import { Input } from "@/components/ui/input";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function DebugConfigSheet({
                              node,
                              open,
                              onOpen,
                          }: {
    node: Node;
    open: boolean;
    onOpen: (open: boolean) => void;
}) {
    const { workflowEditorDispatch } = useWorkflowEditor();

    // 1. Initialize local state from node config (following your schema)
    const [config, setConfig] = useState<DebugNodeConfig>({
        message: node.data?.message || "",
        ...node.data,
    });

    // 2. Debounced sync to global workflow state
    useEffect(() => {
        const hasChanged = JSON.stringify(config) !== JSON.stringify(node.data);
        if (!hasChanged) return;

        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config,
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const handleChange = (key: string, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <SheetWrapper
            nodeId={node.id}
            open={open}
            onOpenChange={onOpen}
            nodeMeta={config.meta}
            onMetaUpdate={handleChange}
            executionConfig={config.executionConfig}
            onExecutionConfigUpdate={(newExec) => handleChange('executionConfig', newExec)}
            className="w-[550px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800"
            title="Debug Configuration"
        >
            <div className="space-y-6 p-2 mt-6">
                <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/50 backdrop-blur-sm space-y-5">
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-tight mb-1">
                        Log Payload
                    </p>

                    {/* MESSAGE / CONTENT */}
                    <div className="space-y-2">
                        <Label className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider">
                            Debug Message
                        </Label>
                        <Textarea
                            value={config.message}
                            onChange={(e) => handleChange("message", e.target.value)}
                            placeholder="Enter message or use {{variable}}..."
                            className="min-h-[120px] text-[11px] bg-neutral-950 border-neutral-800 text-white focus:border-primary/50 focus:ring-0 rounded-xl transition-all resize-none font-mono"
                        />
                    </div>

                    {/* LOG LEVEL - Based on your common debug patterns */}
                    <div className="space-y-2">
                        <Label className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider">
                            Severity Level
                        </Label>
                        <select
                            value={"info"}
                            onChange={(e) => handleChange("logLevel", e.target.value)}
                            className="w-full h-10 text-[11px] bg-neutral-950 border border-neutral-800 text-white rounded-xl px-3 focus:border-primary/50 outline-none appearance-none cursor-pointer transition-all"
                        >
                            <option value="debug">DEBUG</option>
                            <option value="info">INFO</option>
                            <option value="warn">WARNING</option>
                            <option value="error">ERROR</option>
                        </select>
                    </div>
                </div>

                {/* HELPER TEXT */}
                <div className="px-1 flex items-start gap-2">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                    <p className="text-[10px] text-neutral-500 leading-relaxed">
                        Debug nodes output data to the <b>Execution Logs</b> without affecting downstream production logic.
                    </p>
                </div>
            </div>
        </SheetWrapper>
    );
}

export const DebugNodeConfigSheet = memo(DebugConfigSheet);