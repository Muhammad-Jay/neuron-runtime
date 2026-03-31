"use client";

import React, { useMemo } from "react";
import { Node } from "reactflow";
import {
    Database,
    Trash2,
    Zap,
    Info,
    Layers,
    Braces,
    Hash,
    Link2,
    ShieldCheck,
    X
} from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {ContextNode} from "@neuron/shared";

export function ContextNodeConfigSheet({
                                           node: initialNode,
                                           open,
                                           onOpen
                                       }: {
    node: Node,
    open: boolean,
    onOpen: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState } = useWorkflowEditor();

    const activeNode = useMemo(() => {
        const node = editorState.graph.nodes[initialNode.id];

        return node as ContextNode;
    }, [editorState.graph.nodes, initialNode.id]);

    const fields = activeNode.config?.fields ?? {};
    const fieldEntries = Object.entries(fields);

    const removeField = (keyToRemove: string) => {
        const newFields = { ...fields };
        delete newFields[keyToRemove];

        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_NODE,
            id: activeNode.id,
            payload: {
                ...activeNode.config,
                fields: newFields
            }
        });
    };

    const clearRegistry = () => {
        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_NODE,
            id: activeNode.id,
            payload: {
                ...activeNode.config,
                fields: {}
            }
        });
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            title="Context Aggregator"
            showContextSettings={false}
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-3xl border-l border-neutral-900"
        >
            <div className="flex flex-col h-full overflow-hidden">
                {/* SUB-HEADER STATUS */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/20 border-b border-neutral-800/40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Database className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                                storage.v1 // {activeNode.id.split('-')[0]}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-1 h-1 rounded-full",
                            fieldEntries.length > 0 ? "bg-white shadow-[0_0_8px_white]" : "bg-neutral-800"
                        )} />
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">
                            {fieldEntries.length > 0 ? "Sync Active" : "Buffer Null"}
                        </span>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-8 ">
                        {/* SECTION: REGISTERED FIELDS */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-white/5 rounded-md border border-white/10">
                                        <Layers className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                                        Active Registry
                                    </h4>
                                </div>
                                <Badge variant="outline" className="text-[10px] font-mono border-neutral-800 text-neutral-500">
                                    {fieldEntries.length} Slots
                                </Badge>
                            </div>

                            <div className="space-y-2 min-h-full!">
                                {fieldEntries.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 border border-neutral-900 rounded-3xl bg-neutral-900/20">
                                        <Braces className="w-5 h-5 text-neutral-800 mb-3" />
                                        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
                                            No Data Pointers
                                        </p>
                                    </div>
                                ) : (
                                    fieldEntries.map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="group flex items-center justify-between gap-4 bg-neutral-900/40 p-4 rounded-2xl border border-neutral-800/50 hover:border-white/20 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800">
                                                    <Hash className="w-3 h-3 text-neutral-400" />
                                                </div>
                                                <div className="flex flex-col gap-0.5 overflow-hidden">
                                                    <span className="text-[11px] font-mono font-bold text-white truncate">
                                                        {key}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 opacity-40">
                                                        <Link2 className="w-2.5 h-2.5" />
                                                        <span className="text-[9px] font-mono truncate">
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => removeField(key)}
                                                className="p-2.5 text-neutral-600 hover:text-white hover:bg-white/5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* ARCHITECTURAL INFO BOX */}
                        <div className="bg-green-500/[0.10] border border-white/5 rounded-3xl p-6 flex gap-5">
                            <div className="p-2.5 bg-white/5 rounded-2xl h-fit border border-white/10">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">
                                    Logic Verification
                                </p>
                                <p className="text-[10px] text-neutral-500 leading-relaxed">
                                    Fields listed here are dynamically resolved during the execution phase.
                                    Deleting a registry entry here will permanently sever the template reference.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* BOTTOM ACTION BAR */}
                <div className="p-6 pb-3! bg-neutral-950/50 border-t border-neutral-900 flex items-center justify-between">
                    <button
                        onClick={() => onOpen(false)}
                        className="text-[9px] text-neutral-600 hover:text-white font-bold uppercase tracking-widest transition-colors px-2 flex items-center gap-2"
                    >
                        <X className="w-3 h-3" /> Dismiss
                    </button>

                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">Engine State</span>
                            <span className="text-[9px] text-white font-black uppercase tracking-tighter">Ready</span>
                        </div>
                        <button
                            onClick={clearRegistry}
                            className="h-11 px-6 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            <Zap className="w-3.5 h-3.5 fill-black" /> Clear Context
                        </button>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}