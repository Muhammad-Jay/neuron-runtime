"use client";

import React, { memo, useState, useEffect, useMemo } from "react";
import { Node } from "reactflow";
import {
    Send,
    Hash,
    Globe,
    ShieldCheck,
    Code2,
    Activity,
    Zap,
    Database,
    Infinity, Layout
} from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { getAvailableUpstreamNodes } from "@/lib/utils";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { RespondNodeConfig } from "@neuron/shared";

function RespondConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen: (open: boolean) => void }) {
    const { workflowEditorDispatch, editorState } = useWorkflowEditor();
    const { nodes, edges } = editorState.graph;

    // 1. Detect presence of Context Node
    const hasContextNode = useMemo(() =>
            Object.values(nodes).some((n) => n.type === 'contextNode'),
        [nodes]);

    // 2. Initialize local state from node data
    const [config, setConfig] = useState<RespondNodeConfig>({
        statusCode: node.data?.statusCode ?? 200,
        headers: node.data?.headers ?? { "Content-Type": "application/json" },
        body: node.data?.body ?? "",
        attachContext: node.data?.attachContext ?? false,
        options: {
            minify: false,
            includeTraceId: true,
            errorOnEmpty: false,
            ...node.data?.options
        },
        ...node.data,
    });

    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // 3. Debounced sync to global workflow state
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
    }, [config, node.id, workflowEditorDispatch]);

    const handleChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleOptionChange = (key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            options: { ...prev.options, [key]: value }
        }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            nodeMeta={config?.meta}
            onMetaUpdate={handleChange}
            title="Terminal Response"
            showContextSettings={false}
            executionConfig={config.executionConfig}
            onExecutionConfigUpdate={(newExec) => handleChange('executionConfig', newExec)}
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-3xl border-l border-neutral-900"
        >
            <div className="flex flex-col h-full overflow-hidden">
                {/* STATUS SUB-HEADER */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/20 border-b border-neutral-800/40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Send className="w-3.5 h-3.5 text-neutral-400" />
                            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Network Sink // Terminal</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-neutral-800 text-neutral-400 uppercase tracking-tighter bg-transparent">
                        HTTP_FINALIZER
                    </Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 px-3! space-y-8">
                        {/* SECTION: CONTEXT INTEGRATION LAYER */}
                        {hasContextNode && (
                            <div
                                onClick={() => handleChange("attachContext", !config.attachContext)}
                                className={cn(
                                    "w-full border rounded-2xl p-5 transition-all duration-500 overflow-hidden relative cursor-pointer",
                                    config.attachContext
                                        ? "bg-emerald-500/[0.02] border-emerald-500/30 shadow-[0_0_25px_-12px_rgba(16,185,129,0.15)]"
                                        : "bg-neutral-900/40 border-neutral-800"
                                )}>
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "p-2.5 rounded-xl border transition-colors duration-300",
                                            config.attachContext ? "bg-emerald-500/10 border-emerald-500/20" : "bg-neutral-950 border-neutral-800"
                                        )}>
                                            <Database className={cn("w-4 h-4", config.attachContext ? "text-emerald-400" : "text-neutral-500")} />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                                                Context-Aware Mapping
                                            </span>
                                            <span className="text-[9px] text-neutral-500 font-medium">
                                                AUTOMATICALLY ATTACH WORKFLOW CONTEXT DATA INTO RESPONSE
                                            </span>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={config.attachContext}
                                        onCheckedChange={(val) => handleChange("attachContext", val)}
                                        className="data-[state=checked]:bg-emerald-500 shadow-sm"
                                    />
                                </div>

                                {config.attachContext && (
                                    <div className="mt-4 pt-4 border-t border-emerald-500/10 animate-in fade-in slide-in-from-top-2 duration-500">
                                        <div className="flex items-center gap-2 text-emerald-500/70">
                                            <Infinity className="w-3 h-3" />
                                            <p className="text-[9px] font-mono uppercase tracking-tighter">
                                                Registry Linked: Resolving all dynamic pointers in runtime
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SECTION 1: PROTOCOL DEFINITION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-white/5 rounded-md border border-white/10">
                                    <Globe className="w-3.5 h-3.5 text-white" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Protocol</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Hash className="w-3 h-3" /> Status Code
                                    </label>
                                    <Input
                                        type="text"
                                        value={config.statusCode}
                                        onChange={(e) => handleChange("statusCode", e.target.value)}
                                        className="bg-neutral-950 border-neutral-800 text-white text-[11px] h-10 focus:border-white/20 font-mono rounded-xl"
                                        placeholder="200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: PAYLOAD ORCHESTRATION */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-white/5 rounded-md border border-white/10">
                                    <Code2 className="w-3.5 h-3.5 text-white" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Data Payload</h4>
                            </div>

                            <div className="space-y-4 bg-neutral-900/20 p-5 rounded-3xl border border-neutral-800/50">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">JSON Template</label>
                                        <Badge variant="outline" className="text-[8px] border-neutral-800 text-neutral-600 tracking-tighter">REACTIVE_ENGINE_V1</Badge>
                                    </div>
                                    <TemplateTextarea
                                        value={config.body as string}
                                        onChange={(val) => handleChange("body", val)}
                                        variables={availableVariables}
                                        placeholder='{ "status": "resolved", "data": {{node.output}} }'
                                        className="min-h-[180px] font-mono text-[11px] bg-neutral-950 rounded-2xl border-neutral-800 focus:border-white/20 p-4 text-white leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: ADVANCED HEADERS & ENGINE OPTIONS */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="headers" className="border-neutral-900">
                                <AccordionTrigger className="hover:no-underline py-4 group">
                                    <div className="flex items-center gap-2 transition-transform group-hover:translate-x-1 duration-300">
                                        <Layout className="w-3.5 h-3.5 text-neutral-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Response Headers</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pb-4">
                                    <div className="bg-neutral-900/20 p-4 rounded-xl border border-neutral-800 space-y-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input className="h-9 text-[10px] font-mono bg-neutral-950 border-neutral-800 rounded-lg text-neutral-500" value="Content-Type" disabled />
                                            <Input className="h-9 text-[10px] font-mono bg-neutral-950 border-neutral-800 rounded-lg text-neutral-500" value="application/json" disabled />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="options" className="border-neutral-900">
                                <AccordionTrigger className="hover:no-underline py-4 group">
                                    <div className="flex items-center gap-2 transition-transform group-hover:translate-x-1 duration-300">
                                        <Activity className="w-3.5 h-3.5 text-neutral-500" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Engine Directives</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="grid grid-cols-1 gap-3 pb-4">
                                    <div className="flex items-center justify-between p-4 bg-neutral-900/20 rounded-xl border border-neutral-800">
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-bold text-white uppercase">Minify Payload</p>
                                            <p className="text-[9px] text-neutral-500 font-mono">OPTIMIZE_DATA_SIZE</p>
                                        </div>
                                        <Switch
                                            checked={config.options.minify}
                                            onCheckedChange={(val) => handleOptionChange("minify", val)}
                                            className="data-[state=checked]:bg-white data-[state=checked]:[&>span]:bg-black"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-neutral-900/20 rounded-xl border border-neutral-800">
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-bold text-white uppercase">Inject Trace ID</p>
                                            <p className="text-[9px] text-neutral-500 font-mono">APPEND_DEBUG_HEADER</p>
                                        </div>
                                        <Switch
                                            checked={config.options.includeTraceId}
                                            onCheckedChange={(val) => handleOptionChange("includeTraceId", val)}
                                            className="data-[state=checked]:bg-white data-[state=checked]:[&>span]:bg-black"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* HELPER FOOTER BOX */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex gap-5">
                            <div className="p-2.5 bg-white/5 rounded-2xl h-fit border border-white/10">
                                <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[11px] font-bold text-white uppercase tracking-tight">Security Protocol</p>
                                <p className="text-[10px] text-neutral-500 leading-relaxed">
                                    This node marks the absolute termination of the thread. Downstream connections are nullified. Ensure status codes align with external trigger contracts.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="p-6 bg-neutral-950/50 border-t border-neutral-900 flex items-center justify-between">
                    <button
                        onClick={() => handleChange("body", "")}
                        className="text-[10px] text-neutral-600 hover:text-white font-bold uppercase tracking-widest transition-colors"
                    >
                        Reset Schema
                    </button>
                    <div className="flex items-center gap-5">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-tighter italic">Engine Status</span>
                            <span className="text-[9px] text-white font-black uppercase tracking-tighter">Ready</span>
                        </div>
                        <button className="h-11 px-6 bg-white text-black text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            <Zap className="w-3.5 h-3.5 fill-black" /> Deploy Respond
                        </button>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}

export const RespondNodeConfigSheet = memo(RespondConfigSheet);