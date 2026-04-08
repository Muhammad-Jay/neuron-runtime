"use client";

import React, { memo, useEffect, useState } from "react";
import { Node } from "reactflow";
import {
    Code2,
    X,
    Zap,
    Info,
    Terminal,
    Layers
} from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { getAvailableUpstreamNodes } from "@/lib/utils";
import { TransformNodeConfig } from "@neuron/shared";

import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import CodeEditor from "@/components/workflow/editor/CodeEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function TransformConfigSheet({
                                  node,
                                  open,
                                  onOpen
                              }: {
    node: Node,
    open: boolean,
    onOpen?: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    // 1. Initialize local state with full schema spread
    const [config, setConfig] = useState<TransformNodeConfig>({
        code: "// Access upstream data via the 'inputs' object\nreturn inputs;",
        ...node.data,
    });

    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // 2. Debounced sync to global state with change detection
    useEffect(() => {
        const hasChanged = JSON.stringify(config) !== JSON.stringify(node.data);
        if (!hasChanged) return;

        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch, node.data]);

    // 3. Proper state update handlers
    const handleChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleCodeChange = (value: string) => {
        setConfig(prev => ({ ...prev, code: value }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            nodeMeta={config?.meta}
            onMetaUpdate={handleChange}
            nodeId={node.id}
            executionConfig={config.executionConfig}
            onExecutionConfigUpdate={(newExec) => handleChange('executionConfig', newExec)}
            title="Data Transformation"
            className="w-[600px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full">
                {/* HEADER SUB-INFO */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Logic Engine // Runtime</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-purple-500/20 text-purple-400 uppercase tracking-tighter bg-purple-500/5">
                        Javascript V8 (Node 20)
                    </Badge>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 flex flex-col min-h-0 px-6 py-6 space-y-6">

                    {/* EDITOR SECTION */}
                    <div className="flex-1 flex flex-col min-h-0 space-y-3">
                        <div className="flex items-center justify-between px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-yellow-500/10 rounded">
                                    <Zap className="w-3 h-3 text-yellow-500" />
                                </div>
                                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                                    Functional Logic
                                </label>
                            </div>
                        </div>

                        <div className="flex-1 rounded-xl border border-neutral-800 bg-black overflow-hidden relative group shadow-2xl">
                            <CodeEditor
                                value={config.code}
                                onChange={handleCodeChange}
                                height="100%"
                                className="border-none bg-transparent"
                            />
                        </div>
                    </div>

                    {/* CONTEXT EXPLORER */}
                    <div className="shrink-0 space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <Layers className="w-3 h-3 text-neutral-500" />
                            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                                Global Scope Explorer
                            </label>
                        </div>

                        <ScrollArea className="h-48 rounded-xl border border-neutral-800 bg-neutral-900/20 p-4">
                            <div className="space-y-4">
                                {/* Global Variable Info */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <code className="text-purple-400 text-[11px] font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                                            inputs
                                        </code>
                                        <span className="text-[10px] text-neutral-500 font-medium">Immutable Registry</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 leading-relaxed italic">
                                        Contains results from all parent nodes. Access values via
                                        <span className="text-neutral-300 font-mono mx-1">inputs.node_id.output</span>.
                                    </p>
                                </div>

                                {/* Upstream Nodes List */}
                                <div className="pt-3 border-t border-neutral-800/50">
                                    <p className="text-[9px] uppercase font-bold text-neutral-600 mb-2">Resolved Dependencies</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableVariables.length > 0 ? availableVariables.map((v) => (
                                            <div key={v.id} className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800/50 rounded-md px-2 py-1">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                <span className="text-[10px] font-mono text-neutral-400">{v.type || v.id}</span>
                                            </div>
                                        )) : (
                                            <span className="text-[10px] text-neutral-700 italic">No upstream signals detected</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="flex items-start gap-3 text-[10px] text-neutral-500 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                            <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5" />
                            <span className="leading-relaxed">
                                <strong>Sandbox Isolation:</strong> Transformations run in a secure V8 isolate. External networking (fetch, axios) and filesystem access are restricted for security.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}

export const TransformNodeConfigSheet = memo(TransformConfigSheet);