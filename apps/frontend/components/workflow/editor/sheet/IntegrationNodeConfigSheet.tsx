"use client";

import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
    MessageSquare,
    ShieldCheck,
    Settings,
    Info,
    Zap,
    ExternalLink,
    Activity,
    Database,
    ChevronRight,
    Lock
} from "lucide-react";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { INTEGRATION_MANIFEST } from "@/constants";

import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";
import { getAvailableUpstreamNodes } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function IntegrationNodeConfigSheet({ node, open, onOpen }: { node: Node; open: boolean; onOpen: (o: boolean) => void }) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();
    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    const [config, setConfig] = useState(node.data.config || {
        integrationId: "slack",
        connectionId: "",
        actionId: "postMessage",
        parameters: {}
    });

    const manifest = INTEGRATION_MANIFEST[config.integrationId];
    const currentAction = manifest?.actions.find(a => a.id === config.actionId);

    useEffect(() => {
        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config,
            });
        }, 400);
        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const updateParam = (key: string, value: string) => {
        setConfig((prev: any) => ({
            ...prev,
            parameters: { ...prev.parameters, [key]: value }
        }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            title={manifest?.label || 'Integration'}
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full overflow-hidden">

                {/* SUB-HEADER / STATUS BAR */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-mono text-neutral-400">Node Status: Ready</span>
                        </div>
                        <div className="w-px h-3 bg-neutral-800" />
                        <div className="flex items-center gap-2">
                            <Database className="w-3 h-3 text-blue-500" />
                            <span className="text-[10px] font-mono text-neutral-400">ID: {node.id.slice(0, 8)}</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-neutral-800 text-neutral-500 uppercase">
                        V2.4 Runtime
                    </Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">

                        {/* SECTION: INFRASTRUCTURE (Auth & Action) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-blue-500/10 rounded-md">
                                    <Settings className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">System Gateway</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">Account Connection</label>
                                    <Select
                                        value={config.connectionId}
                                        onValueChange={(val) => setConfig((p) => ({ ...p, connectionId: val }))}
                                    >
                                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-xs focus:ring-1 focus:ring-primary h-9">
                                            <div className="flex items-center gap-2">
                                                {config.connectionId ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3" />}
                                                <SelectValue placeholder="Select Account" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-950 border-neutral-800">
                                            <SelectItem value="conn_1">Muhammad&#39;s Slack</SelectItem>
                                            <SelectItem value="conn_2">API Key</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">Target Action</label>
                                    <Select
                                        value={config.actionId}
                                        onValueChange={(val) => setConfig((p) => ({ ...p, actionId: val, parameters: {} }))}
                                    >
                                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-xs focus:ring-1 focus:ring-primary! h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-950 border-neutral-800">
                                            {manifest?.actions.map(action => (
                                                <SelectItem key={action.id} value={action.id}>{action.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* SECTION: PARAMETERS (Dynamic Fields) */}
                        <div className="space-y-4 pt-4 border-t border-neutral-900">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-500/10 rounded-md">
                                        <Zap className="w-3.5 h-3.5 text-purple-500" />
                                    </div>
                                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Payload Configuration</h4>
                                </div>
                                {currentAction && (
                                    <span className="text-[9px] text-neutral-600 font-mono italic">
                                        Endpoint: {currentAction.id}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-5 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
                                {currentAction?.fields.map((field) => (
                                    <div key={field.id} className="space-y-2 group">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-bold text-neutral-400 group-focus-within:text-primary! transition-colors">
                                                {field.label}
                                            </label>
                                            {field.type === "textarea" && (
                                                <Badge variant="outline" className="text-[8px] h-3.5 border-neutral-800 text-neutral-600 font-mono">JS Template</Badge>
                                            )}
                                        </div>

                                        {field.type === "textarea" ? (
                                            <div className="relative group/field">
                                                <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-neutral-800 group-focus-within/field:bg-primary/50 transition-colors rounded-full" />
                                                <TemplateTextarea
                                                    value={config.parameters[field.id] || ""}
                                                    onChange={(val) => updateParam(field.id, val)}
                                                    variables={availableVariables}
                                                    className="bg-black/60 border-neutral-800 min-h-[140px] text-[12px] font-mono leading-relaxed focus:border-primary/30 transition-all rounded-lg"
                                                    placeholder={field.placeholder}
                                                />
                                            </div>
                                        ) : (
                                            <Input
                                                value={config.parameters[field.id] || ""}
                                                onChange={(e) => updateParam(field.id, e.target.value)}
                                                className="bg-black/60 border-neutral-800 text-xs h-10 focus:border-primary/30 transition-all"
                                                placeholder={field.placeholder}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* HELPER BOX */}
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                                <Info className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-neutral-300">Variable Injection Enabled</p>
                                <p className="text-[10px] text-neutral-500 leading-normal">
                                    Type <code className="text-blue-400 bg-blue-400/5 px-1 rounded">{"{{ "}</code> to browse data from upstream nodes. Use <code className="text-neutral-300">inputs.node_id</code> to access raw JSON payloads.
                                </p>
                                <button className="flex items-center gap-1 text-[10px] text-blue-500 font-medium pt-1 hover:underline">
                                    View full documentation <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* ACTION FOOTER */}
                <div className="p-4 bg-neutral-900/20 border-t border-neutral-800 flex items-center justify-between">
                    <button className="text-[10px] text-neutral-500 hover:text-neutral-300 font-medium transition-colors">
                        Clear All Parameters
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-neutral-600 flex items-center gap-1">
                            <ChevronRight className="w-2 h-2" /> Changes save automatically
                        </span>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}