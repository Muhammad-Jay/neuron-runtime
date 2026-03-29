"use client";

import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
    Send,
    Hash,
    Globe,
    ShieldCheck,
    Code2,
    Activity,
    Info,
    ExternalLink,
    Zap,
    Layout
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

export function RespondNodeConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen: (open: boolean) => void }) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    const [config, setConfig] = useState({
        statusCode: node.data.config?.statusCode ?? 200,
        headers: node.data.config?.headers ?? { "Content-Type": "application/json" },
        body: node.data.config?.body ?? "",
        options: {
            minify: false,
            includeTraceId: true,
            errorOnEmpty: false,
            ...node.data.config?.options
        },
        ...node.data.config,
    });

    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

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
            title="Terminal Response"
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full overflow-hidden">

                {/* STATUS SUB-HEADER */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Send className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Node Type: Network Sink</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-emerald-900/50 text-emerald-500 uppercase tracking-tight bg-emerald-500/5">
                        HTTP Finalizer
                    </Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">

                        {/* SECTION 1: PROTOCOL DEFINITION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-emerald-500/10 rounded-md">
                                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Protocol Definition</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1 flex items-center gap-1.5">
                                        <Hash className="w-3 h-3" /> Exit Status Code
                                    </label>
                                    <Input
                                        type="text"
                                        value={config.statusCode}
                                        onChange={(e) => handleChange("statusCode", e.target.value)}
                                        className="bg-black/60 border-neutral-800 text-xs h-9 focus:border-emerald-500/50 font-mono"
                                        placeholder="200"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: PAYLOAD ORCHESTRATION */}
                        <div className="space-y-4 pt-4 border-t border-neutral-900">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-purple-500/10 rounded-md">
                                    <Code2 className="w-3.5 h-3.5 text-purple-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Payload Orchestration</h4>
                            </div>

                            <div className="space-y-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold text-neutral-400">JSON Response Body</label>
                                        <Badge variant="outline" className="text-[8px] opacity-50">Supports Templates</Badge>
                                    </div>
                                    <TemplateTextarea
                                        value={config.body}
                                        onChange={(val) => handleChange("body", val)}
                                        variables={availableVariables}
                                        placeholder='{ "success": true, "data": {{node_id.output}} }'
                                        className="min-h-[200px] font-mono text-[11px]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: ADVANCED HEADERS & ENGINE OPTIONS */}
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="headers" className="border-neutral-800">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Layout className="w-3.5 h-3.5 text-neutral-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Custom Headers</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pb-4">
                                    <div className="bg-black/40 p-3 rounded-lg border border-neutral-800 space-y-2">
                                        <p className="text-[10px] text-neutral-500 italic mb-2">Define key-value pairs for the response header.</p>
                                        {/* Simplified header input - can be expanded to dynamic rows */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <Input className="h-8 text-[10px] bg-transparent" placeholder="Content-Type" disabled value="Content-Type" />
                                            <Input className="h-8 text-[10px] bg-transparent" placeholder="application/json" disabled value="application/json" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="options" className="border-neutral-800">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-3.5 h-3.5 text-neutral-400" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Engine Directives</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="grid grid-cols-1 gap-3 pb-4">
                                    <div className="flex items-center justify-between p-3 bg-neutral-900/30 rounded-lg border border-neutral-800">
                                        <div className="space-y-0.5">
                                            <p className="text-xs text-neutral-300">Minify Payload</p>
                                            <p className="text-[9px] text-neutral-500">Remove all whitespace from output</p>
                                        </div>
                                        <Switch
                                            checked={config.options.minify}
                                            onCheckedChange={(val) => handleOptionChange("minify", val)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-neutral-900/30 rounded-lg border border-neutral-800">
                                        <div className="space-y-0.5">
                                            <p className="text-xs text-neutral-300">Inject Trace ID</p>
                                            <p className="text-[9px] text-neutral-500">Append Lazarus-Trace-ID header</p>
                                        </div>
                                        <Switch
                                            checked={config.options.includeTraceId}
                                            onCheckedChange={(val) => handleOptionChange("includeTraceId", val)}
                                            className="data-[state=checked]:bg-emerald-500"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {/* HELPER FOOTER BOX */}
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg h-fit">
                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-neutral-300">Terminal Node Safety</p>
                                <p className="text-[10px] text-neutral-500 leading-normal">
                                    This node marks the absolute end of the execution thread. Any nodes placed downstream will be ignored. Ensure your status code matches the expected <code className="text-emerald-400 bg-emerald-400/5 px-1 rounded">Webhook</code> trigger contract.
                                </p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="p-4 bg-neutral-900/40 border-t border-neutral-800 flex items-center justify-between">
                    <button className="text-[10px] text-neutral-500 hover:text-neutral-300 font-medium transition-colors">
                        Reset Protocol
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-neutral-600 flex items-center gap-1 italic">
                            Connection: Awaiting Resolve
                        </span>
                        <button className="h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 fill-black" /> Deploy Respond
                        </button>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}