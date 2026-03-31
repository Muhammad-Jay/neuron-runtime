"use client";

import React, { useEffect, useState } from "react";
import { Node } from "reactflow";
import {
    Code2,
    X,
    Zap,
    Info,
    Terminal,
    Layers,
    ChevronRight
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

export function TransformNodeConfigSheet({
                                             node,
                                             open,
                                             onOpen
                                         }: {
    node: Node,
    open: boolean,
    onOpen?: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    // 1. Initialize local state
    const [config, setConfig] = useState<TransformNodeConfig>({
        code: node.data.config?.code || "// Access upstream data via the 'inputs' object\nreturn inputs;",
    });

    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // 2. Debounced sync to global state
    useEffect(() => {
        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const handleCodeChange = (value: string) => {
        setConfig({ code: value });
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            nodeId={node.id}
            className="w-[600px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full">
                {/* HEADER - Consistent with HTTP Node */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Code2 className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-200">Data Transformation</h3>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Logic Engine</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onOpen?.(false)}
                        className="h-8 w-8 text-neutral-500 hover:text-white"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 flex flex-col min-h-0 px-6 py-4 space-y-4">

                    {/* INFO STRIP */}
                    <div className="flex items-center justify-between bg-neutral-900/40 border border-neutral-800 rounded-lg px-4 py-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3 h-3 text-neutral-500" />
                            <span className="text-[10px] font-mono text-neutral-400">runtime: node-js-20</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] bg-purple-500/5 text-primary border-primary uppercase tracking-tighter">
                            Javascript V8
                        </Badge>
                    </div>

                    {/* EDITOR SECTION */}
                    <div className="flex-1 flex flex-col min-h-0 space-y-2">
                        <div className="flex items-center justify-between px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                                    Code Editor
                                </label>
                            </div>
                        </div>

                        <div className="flex-1 rounded-md border border-neutral-950 p-3 bg-black overflow-hidden relative group">
                            <CodeEditor
                                value={config.code}
                                onChange={handleCodeChange}
                                height="100%"
                                className="border-none bg-transparent h-[400px]"
                            />
                        </div>
                    </div>

                    {/* FOOTER / DOCS SECTION */}
                    <div className="shrink-0 space-y-3 pt-2">
                        <div className="flex items-center gap-2 px-1">
                            <Layers className="w-3 h-3 text-neutral-500" />
                            <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                                Context Explorer
                            </label>
                        </div>

                        <ScrollArea className="h-62 rounded-xl border border-neutral-800 bg-neutral-900/20 p-4">
                            <div className="space-y-4">
                                {/* Global Variable Info */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <code className="text-primary text-[11px] font-bold bg-purple-500/10 px-1.5 py-0.5 rounded border border-primary">
                                            inputs
                                        </code>
                                        <span className="text-[10px] text-neutral-400 font-medium">Global Object</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-500 leading-relaxed italic">
                                        Contains results from all connected parent nodes. Map them using
                                        <span className="text-neutral-300"> inputs.node_id.output</span>.
                                    </p>
                                </div>

                                {/* Upstream Nodes List */}
                                <div className="pt-2 border-t border-neutral-800/50">
                                    <p className="text-[9px] uppercase font-bold text-neutral-600 mb-2">Connected Upstream</p>
                                    <div className="flex flex-wrap gap-2">
                                        {availableVariables.length > 0 ? availableVariables.map((v) => (
                                            <div key={v.id} className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded px-2 py-1">
                                                <div className="w-1 h-1 rounded-full bg-green-500" />
                                                <span className="text-[10px] font-mono text-neutral-400">{v.type || v.id}</span>
                                            </div>
                                        )) : (
                                            <span className="text-[10px] text-neutral-700 italic">No upstream nodes connected</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        <div className="flex items-center gap-2 text-[10px] text-neutral-600 bg-neutral-950/50 p-2 rounded-lg border border-neutral-900">
                            <Info className="w-3 h-3" />
                            <span>Transformations run in an isolated sandbox. External network calls are disabled here.</span>
                        </div>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}