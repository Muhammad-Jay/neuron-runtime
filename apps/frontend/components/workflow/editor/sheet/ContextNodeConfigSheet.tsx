"use client";

import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
    Database,
    Plus,
    Trash2,
    Zap,
    Info,
    Layers,
    Braces,
    ArrowRightLeft
} from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { getAvailableUpstreamNodes } from "@/lib/utils";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ContextNodeConfigSheet({
                                           node,
                                           open,
                                           onOpen
                                       }: {
    node: Node,
    open: boolean,
    onOpen: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    // Internal state for the key-value record
    const [fields, setFields] = useState<Record<string, any>>(node.data.config?.fields ?? {});

    // Get variables from nodes that come BEFORE this one in the graph
    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // Auto-save to global workflow state when fields change
    useEffect(() => {
        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: {
                    ...node.data.config,
                    fields
                }
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [fields, node.id, workflowEditorDispatch]);

    const addField = () => {
        const newKey = `key_${Object.keys(fields).length + 1}`;
        setFields(prev => ({ ...prev, [newKey]: "" }));
    };

    const removeField = (keyToRemove: string) => {
        setFields(prev => {
            const { [keyToRemove]: _, ...rest } = prev;
            return rest;
        });
    };

    const updateFieldKey = (oldKey: string, newKey: string) => {
        if (oldKey === newKey) return;
        setFields(prev => {
            const newFields = { ...prev };
            newFields[newKey] = newFields[oldKey];
            delete newFields[oldKey];
            return newFields;
        });
    };

    const updateFieldValue = (key: string, value: any) => {
        setFields(prev => ({ ...prev, [key]: value }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            title="Context Aggregator"
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full overflow-hidden">

                {/* SUB-HEADER STATUS */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Database className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Node Type: Data Store</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-amber-900/30 text-amber-500 uppercase tracking-tight bg-amber-500/5">
                        Schema Builder
                    </Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">

                        {/* SECTION: DATA MAPPING */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-amber-500/10 rounded-md">
                                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                                    </div>
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Record Mapping</h4>
                                </div>
                                <button
                                    onClick={addField}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-all group"
                                >
                                    <Plus className="w-3 h-3 text-amber-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-bold uppercase text-neutral-400">Add Field</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {Object.entries(fields).length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 border border-dashed border-neutral-800 rounded-2xl bg-neutral-900/10">
                                        <Braces className="w-8 h-8 text-neutral-800 mb-2" />
                                        <p className="text-[10px] text-neutral-600 font-medium">No fields mapped yet.</p>
                                    </div>
                                ) : (
                                    Object.entries(fields).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="group grid grid-cols-[1fr,1.5fr,40px] gap-2 items-start bg-neutral-900/20 p-3 rounded-xl border border-neutral-800/50 hover:border-amber-500/30 transition-colors"
                                        >
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-bold text-neutral-600 uppercase ml-1">Key Name</label>
                                                <Input
                                                    value={key}
                                                    onChange={(e) => updateFieldKey(key, e.target.value)}
                                                    className="bg-black/40 border-neutral-800 text-[10px] font-mono h-8 focus:border-amber-500/50"
                                                    placeholder="e.g. user_id"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-bold text-neutral-600 uppercase ml-1">Value / Template</label>
                                                <TemplateTextarea
                                                    value={value}
                                                    onChange={(val) => updateFieldValue(key, val)}
                                                    variables={availableVariables}
                                                    placeholder="{{node_output}}"
                                                    className="min-h-[32px] text-[10px] py-1.5 bg-black/40 border-neutral-800"
                                                />
                                            </div>

                                            <div className="pt-6 flex justify-center">
                                                <button
                                                    onClick={() => removeField(key)}
                                                    className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* HELPER INFO BOX */}
                        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex gap-4">
                            <div className="p-2 bg-amber-500/10 rounded-lg h-fit">
                                <Info className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-neutral-300">Aggregation Logic</p>
                                <p className="text-[10px] text-neutral-500 leading-normal">
                                    The Context Node builds a <code className="text-amber-400 bg-amber-400/5 px-1 rounded">Record&lt;string, any&gt;</code>.
                                    When referenced by a Respond Node, the entire object will be stringified as the final JSON body.
                                </p>
                                <button className="flex items-center gap-1 text-[10px] text-amber-500 font-medium pt-1 hover:underline">
                                    Learn about schema nesting <ArrowRightLeft className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="p-4 bg-neutral-900/40 border-t border-neutral-800 flex items-center justify-between">
                    <button
                        onClick={() => setFields({})}
                        className="text-[10px] text-neutral-500 hover:text-red-400 font-medium transition-colors"
                    >
                        Flush Aggregator
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-neutral-600 italic">
                            {Object.keys(fields).length} keys mapped
                        </span>
                        <button
                            onClick={() => onOpen(false)}
                            className="h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2 active:scale-95 transition-transform"
                        >
                            <Zap className="w-3.5 h-3.5 fill-black" /> Commit Schema
                        </button>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}