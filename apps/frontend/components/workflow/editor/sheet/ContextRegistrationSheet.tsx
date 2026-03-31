"use client";

import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, Share2, AlertCircle, Link2 } from "lucide-react";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import {ContextNode, NodeConfigType} from "@neuron/shared";
import { cn } from "@/lib/utils";

export const ContextRegistrationSheet = ({ nodeId }: { nodeId: string }) => {
    const { editorState, workflowEditorDispatch } = useWorkflowEditor();

    // Direct state lookup for reactivity
    const nodes = editorState.graph.nodes;
    const currentNode = nodes[nodeId];
    const contextNode = Object.values(nodes).find((n) => n.type === 'contextNode') as ContextNode;

    if (!currentNode) return null;

    const config: NodeConfigType = currentNode.config;
    const isActive = config.persistToContext && !!contextNode;

    const handleToggle = (checked: boolean) => {
        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_NODE,
            id: nodeId,
            payload: {
                ...config,
                persistToContext: checked,
                contextNodeId: checked ? contextNode?.id : undefined
            }
        });

        if (checked && contextNode) {
            const aliasKey = config.alias || nodeId;
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: contextNode.id,
                payload: {
                    ...contextNode.config,
                    fields: {
                        ...contextNode.config.fields,
                        [aliasKey]: `{{${nodeId}}}`
                    }
                }
            });
        }
    };

    const handleAliasChange = (newAlias: string) => {
        const oldAlias = config.alias || nodeId;

        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_NODE,
            id: nodeId,
            payload: { ...config, alias: newAlias }
        });

        if (config.persistToContext && contextNode) {
            const newFields = { ...contextNode.config.fields };
            delete newFields[oldAlias];
            newFields[newAlias || nodeId] = `{{${nodeId}}}`;

            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: contextNode.id,
                payload: {
                    ...contextNode.config,
                    fields: newFields
                }
            });
        }
    };

    return (
        <Collapsible
            className={cn(
                "w-full border rounded-2xl p-4 transition-all duration-500",
                isActive
                    ? "bg-emerald-500/[0.03] border-emerald-500/30 shadow-[0_0_20px_-10px_rgba(16,185,129,0.2)]"
                    : "bg-neutral-900/40 border-neutral-800"
            )}
        >
            <CollapsibleTrigger className="flex items-center justify-between w-full group">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-xl border transition-colors duration-300",
                        isActive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-neutral-950 border-neutral-800"
                    )}>
                        <Share2 className={cn("w-4 h-4", isActive ? "text-emerald-400" : "text-neutral-500")} />
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">
                            Context Sync
                        </span>
                        <span className="text-[9px] text-neutral-500 font-medium">
                            {isActive ? "ACTIVE REGISTRY" : "LOCAL SCOPE"}
                        </span>
                    </div>
                </div>
                <ChevronDown className={cn(
                    "w-4 h-4 text-neutral-600 transition-transform duration-300 group-data-[state=open]:rotate-180",
                    isActive && "text-emerald-500/50"
                )} />
            </CollapsibleTrigger>

            <CollapsibleContent className="pt-6 space-y-5">
                <div onClick={() => handleToggle(!isActive)} className="flex items-center justify-between bg-black/20 p-3 rounded-xl border hover:bg-black/15 transition-200 border-neutral-800/50">
                    <div className="space-y-1">
                        <Label htmlFor="persist" className="text-white text-[10px] font-bold uppercase tracking-tight cursor-pointer">
                            Expose Output
                        </Label>
                        {!contextNode && (
                            <p className="text-[9px] text-amber-500/80 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-2.5 h-2.5" /> REQUIRED: CONTEXT_NODE_MISSING
                            </p>
                        )}
                    </div>
                    <Switch
                        id="persist"
                        checked={config.persistToContext || false}
                        onCheckedChange={handleToggle}
                        disabled={!contextNode}
                        className="data-[state=checked]:bg-emerald-500"
                    />
                </div>

                {config.persistToContext && (
                    <div className="space-y-2.5 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 px-1">
                            <Link2 className="w-3 h-3 text-neutral-500" />
                            <Label className="text-[9px] text-neutral-500 uppercase font-black tracking-widest">
                                Registry Alias
                            </Label>
                        </div>
                        <Input
                            placeholder="e.g. data_source"
                            value={config.alias || ""}
                            onChange={(e) => handleAliasChange(e.target.value)}
                            className="h-10 text-[11px] font-mono bg-neutral-950 border-neutral-800 text-white focus:border-emerald-500/50 focus:ring-0 rounded-xl transition-all"
                        />
                    </div>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
};