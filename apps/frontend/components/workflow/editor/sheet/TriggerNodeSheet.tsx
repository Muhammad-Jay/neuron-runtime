"use client";

import React, { memo, useEffect, useState } from "react";
import { Node } from "reactflow";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Clock, MousePointerIcon, Settings2, ShieldCheck } from "lucide-react";
import { TriggerNodeConfig } from "@neuron/shared"; // Assuming schema type exists

function TriggerConfigSheet({ node, open, onOpen }: { node: Node; open: boolean; onOpen: (open: boolean) => void }) {
    const { workflowEditorDispatch } = useWorkflowEditor();

    // 1. Initialize local state from node data
    const [config, setConfig] = useState<TriggerNodeConfig>({
        name: "Primary Inbound Entry",
        triggerType: "manual",
        cron: "* * * * *",
        webhookUrl: "",
        ...node.data,
    });

    // 2. Standard Debounced Sync to Global State
    useEffect(() => {
        const hasChanged = JSON.stringify(config) !== JSON.stringify(node.data);
        if (!hasChanged) return;

        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config
            });
        }, 400);

        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const handleChange = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
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
            title="Trigger Initiation"
            className="w-[500px]! p-0! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-900"
        >
            <div className="flex flex-col h-full overflow-hidden">

                {/* STATUS SUB-HEADER */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-2">
                        <Settings2 className="w-3.5 h-3.5 text-neutral-500" />
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Entry Protocol // Root</span>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* SECTION: IDENTITY */}
                    <section className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Friendly Name</Label>
                            <Input
                                value={" "}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="e.g. Primary Inbound Entry"
                                className="bg-neutral-900/50 border-neutral-800 focus:border-white/20 h-10 transition-all rounded-xl text-xs"
                            />
                        </div>
                    </section>

                    {/* SECTION: TRIGGER TYPE */}
                    <section className="space-y-4">
                        <header className="flex items-center gap-2 text-neutral-400 px-1">
                            <MousePointerIcon size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Activation Method</span>
                        </header>

                        <RadioGroup
                            value={config.triggerType}
                            onValueChange={(value) => handleChange("triggerType", value)}
                            className="grid grid-cols-1 gap-3"
                        >
                            <TriggerTypeOption
                                value="manual"
                                icon={MousePointerIcon}
                                title="Manual Execution"
                                description="Trigger this sequence directly from the dashboard."
                                isActive={config.triggerType === "manual"}
                            />
                            <TriggerTypeOption
                                value="webhook"
                                icon={Globe}
                                title="External Webhook"
                                description="Invoke via an HTTP POST request from another service."
                                isActive={config.triggerType === "webhook"}
                            />
                            <TriggerTypeOption
                                value="schedule"
                                icon={Clock}
                                title="Scheduled Interval"
                                description="Automate execution based on a specific time frequency."
                                isActive={config.triggerType === "schedule"}
                            />
                        </RadioGroup>
                    </section>

                    {/* SECTION: CONDITIONAL PARAMS */}
                    {config.triggerType === "schedule" && (
                        <section className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Cron Schedule</Label>
                                <Input
                                    value={""}
                                    onChange={(e) => handleChange("cron", e.target.value)}
                                    placeholder="* * * * *"
                                    className="bg-black/40 border-neutral-800 font-mono tracking-widest h-10 text-emerald-400 rounded-lg"
                                />
                            </div>
                            <p className="text-[10px] text-neutral-500 leading-relaxed italic">
                                Sequence will resolve based on standard crontab syntax.
                            </p>
                        </section>
                    )}

                    {config.triggerType === "webhook" && (
                        <section className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Endpoint URL</Label>
                                <Input
                                    readOnly
                                    value={`https://api.neuron.engine/v1/wh/${node.id}`}
                                    className="bg-black/40 border-neutral-800 h-10 text-[11px] truncate font-mono text-blue-400 rounded-lg"
                                />
                            </div>
                            <div className="flex items-start gap-2 text-[10px] text-neutral-500">
                                <ShieldCheck className="w-3.5 h-3.5 text-neutral-600 mt-0.5" />
                                <span>Requests are authenticated via your Workspace API Key.</span>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </SheetWrapper>
    );
}

// Helper component for the activation options
function TriggerTypeOption({ value, icon: Icon, title, description, isActive }: any) {
    return (
        <Label
            className={`
                flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group
                ${isActive
                ? 'bg-white/5 border-white/20 shadow-[0_0_20px_-12px_rgba(255,255,255,0.2)]'
                : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'}
            `}
        >
            <RadioGroupItem value={value} className="sr-only" />
            <div className={`
                mt-0.5 p-2 rounded-xl border transition-colors
                ${isActive ? 'bg-white text-black border-white' : 'bg-neutral-950 text-neutral-500 border-neutral-800 group-hover:border-neutral-700'}
            `}>
                <Icon size={16} />
            </div>
            <div className="space-y-1">
                <p className={`text-xs font-bold tracking-tight ${isActive ? 'text-white' : 'text-neutral-400'}`}>
                    {title}
                </p>
                <p className="text-[10px] text-neutral-500 leading-relaxed font-medium">
                    {description}
                </p>
            </div>
        </Label>
    );
}

export const TriggerNodeConfigSheet = memo(TriggerConfigSheet);