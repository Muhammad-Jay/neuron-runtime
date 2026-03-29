"use client";

import React, { useEffect, useState } from "react";
import { Node } from "reactflow";
import {
    Globe,
    X,
    Settings2,
    ChevronDown,
    Database,
    Key,
    Activity
} from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType, HTTP_METHODS } from "@/constants";
import { getAvailableUpstreamNodes } from "@/lib/utils";
import { HttpRequestNodeConfig } from "../../../../../shared/src/types/node.types";

import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";
import { HeadersEditor } from "./HeaderEditor";
import FormField from "@/components/FormField";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {Label} from "@/components/ui/label";

export function HttpRequestNodeConfigSheet({
                                               node,
                                               open,
                                               onOpen
                                           }: {
    node: Node,
    open: boolean,
    onOpen?: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    // Internal state for snappy UI feedback
    const [config, setConfig] = useState<HttpRequestNodeConfig>({
        ...node.data.config,
        headers: node.data.config?.headers || {},
        body: node.data.config?.body || {}
    });

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        headers: true,
        body: true
    });

    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // Debounced update to the global workflow state
    useEffect(() => {
        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config
            });
        }, 200);
        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const handleChange = (key: string, value: any) => {
        setConfig(prevState => ({ ...prevState, [key]: value }));
    };

    const toggleSection = (section: string) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            className="w-[600px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full">
                {/* HEADER - Consistent with Decision Node */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Globe className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-200">HTTP Request</h3>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Network Connector</p>
                        </div>
                    </div>
                    <div

                        className="h-8 w-8 text-neutral-500 hover:text-white"
                    >

                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col min-h-0 px-6 py-4 space-y-6">

                    {/* PINNED PRIMARY CONFIG (METHOD & URL) */}
                    <section className="space-y-4 shrink-0">
                        <div className="flex w-full flex-col gap-5">
                            <div className="flex items-start! justify-start flex-row w-full gap-3">
                                <FormField
                                    label="Method"
                                    type="select"
                                    path="method"
                                    className="space-y-2 self-start! w-full"
                                    value={config.method}
                                    onChange={handleChange}
                                    options={HTTP_METHODS}
                                />
                            </div>
                            <div className="col-span-3">
                                <TemplateTextarea
                                    label="Endpoint URL"
                                    value={config.url}
                                    variables={availableVariables}
                                    onChange={(val) => handleChange("url", val)}
                                    placeholder="https://api.example.com/v1"
                                    className="min-h-[38px] bg-neutral-900/40 border-neutral-800"
                                />
                            </div>
                        </div>
                    </section>

                    {/* SCROLLABLE CONFIG AREA (HEADERS & BODY) */}
                    <section className="flex-1 flex flex-col min-h-0 space-y-4">
                        <div className="flex items-center gap-2 px-1 shrink-0">
                            <Settings2 className="w-3 h-3 text-neutral-500" />
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                Parameters & Payloads
                            </label>
                        </div>

                        <ScrollArea className="flex-1 pr-4 -mr-4">
                            <div className="space-y-4 pb-8">

                                {/* HEADERS COLLAPSIBLE */}
                                <Collapsible
                                    open={openSections.headers}
                                    onOpenChange={() => toggleSection('headers')}
                                    className="group border border-neutral-800 bg-neutral-900/20 rounded-xl overflow-hidden transition-all hover:border-neutral-700"
                                >
                                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-neutral-800/30 transition-colors text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-600 group-hover:text-blue-400 transition-colors">
                                                <Key className="w-3 h-3" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-mono text-neutral-300 leading-none mb-1">Request Headers</span>
                                                <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-tighter">
                                                    {Object.keys(config.headers || {}).length} pairs defined
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-neutral-700 group-data-[state=open]:rotate-180 transition-transform" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="border-t border-neutral-800/50 p-4 bg-black/40 animate-in slide-in-from-top-2 duration-200">
                                        <HeadersEditor
                                            headers={config.headers}
                                            variables={availableVariables}
                                            onChange={(headers) => handleChange("headers", headers)}
                                        />
                                    </CollapsibleContent>
                                </Collapsible>

                                {/* BODY COLLAPSIBLE (Only if not GET) */}
                                {config.method !== "GET" && (
                                    <Collapsible
                                        open={openSections.body}
                                        onOpenChange={() => toggleSection('body')}
                                        className="group border border-neutral-800 bg-neutral-900/20 rounded-xl overflow-hidden transition-all hover:border-neutral-700"
                                    >
                                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-neutral-800/30 transition-colors text-left">
                                            <div className="flex items-center gap-4">
                                                <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-600 group-hover:text-emerald-400 transition-colors">
                                                    <Database className="w-3 h-3" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-mono text-neutral-300 leading-none mb-1">JSON Body</span>
                                                    <span className="text-[9px] text-neutral-500 uppercase font-bold tracking-tighter">Payload Configuration</span>
                                                </div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-neutral-700 group-data-[state=open]:rotate-180 transition-transform" />
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="border-t border-neutral-800/50 p-4 bg-black/40 animate-in slide-in-from-top-2 duration-200">
                                            <HeadersEditor
                                                headers={config.body}
                                                variables={availableVariables}
                                                onChange={(body) => handleChange("body", body)}
                                            />
                                        </CollapsibleContent>
                                    </Collapsible>
                                )}

                                {/* ADVANCED SETTINGS PLACEHOLDER */}
                                <div className="p-4 border border-dashed border-neutral-800 rounded-xl opacity-50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity className="w-3 h-3 text-neutral-500" />
                                        <span className="text-[10px] uppercase font-bold text-neutral-500">Retry Policy</span>
                                    </div>
                                    <span className="text-[9px] text-neutral-700 font-mono italic">Coming Soon</span>
                                </div>

                            </div>
                        </ScrollArea>
                    </section>
                </div>
            </div>
        </SheetWrapper>
    );
}