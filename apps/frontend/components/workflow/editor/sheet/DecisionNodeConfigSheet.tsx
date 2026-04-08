"use client";

import React, { memo, useEffect, useState } from "react";
import { Node } from "reactflow";
import {
    Plus,
    X,
    ChevronDown,
    GripVertical,
    Split,
    Type,
    Settings2,
    Trash2
} from "lucide-react";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { getAvailableUpstreamNodes, cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { DecisionNodeConfig, DecisionRule } from "@neuron/shared";

const TRANSFORMS = ["toLowerCase", "toUpperCase", "trim", "toString", "toNumber"];
const OPERATORS = ["==", "!=", ">", "<", "includes", "exists"];

function DecisionConfigSheet({
                                 node,
                                 open,
                                 onOpen
                             }: {
    node: Node,
    open: boolean,
    onOpen?: (open: boolean) => void
}) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges } } } = useWorkflowEditor();

    // 1. Initialize local state from node data
    const [config, setConfig] = useState<DecisionNodeConfig>({
        input: node.data?.input || "",
        inputTransforms: node.data?.inputTransforms || [],
        rules: node.data?.rules || [],
        includeDefault: node.data?.includeDefault ?? true,
        ...node.data
    });

    const [openRules, setOpenRules] = useState<Record<string, boolean>>({});
    const availableVariables = getAvailableUpstreamNodes(node.id, { nodes, edges });

    // 2. Debounced sync to global workflow state
    useEffect(() => {
        const hasChanged = JSON.stringify(config) !== JSON.stringify(node.data);
        if (!hasChanged) return;

        const timer = setTimeout(() => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE,
                id: node.id,
                payload: config
            });
        }, 300); // Standardized to 300ms for Neuron consistency

        return () => clearTimeout(timer);
    }, [config, node.id, workflowEditorDispatch]);

    const handleChange = (key: keyof DecisionNodeConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const addRule = () => {
        if (config.rules.length >= 10) return; // Increased limit for complex flows
        const id = crypto.randomUUID();
        const newRule: DecisionRule = {
            id,
            operator: "==",
            value: "",
            transforms: [],
            label: `Case ${config.rules.length + 1}`
        };
        handleChange("rules", [...config.rules, newRule]);
        setOpenRules(prev => ({ ...prev, [id]: true }));
    };

    const updateRule = (id: string, patch: Partial<DecisionRule>) => {
        const nextRules = config.rules.map((r) => r.id === id ? { ...r, ...patch } : r);
        handleChange("rules", nextRules);
    };

    const toggleTransform = (current: string[], t: string) =>
        current.includes(t) ? current.filter(x => x !== t) : [...current, t];

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            nodeId={node.id}
            nodeMeta={config?.meta}
            onMetaUpdate={handleChange}
            className="w-[550px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800"
            title="Decision Logic"
        >
            <div className="flex flex-col h-full space-y-6 mt-6">

                {/* INPUT SOURCE SECTION */}
                <section className="space-y-3 shrink-0">
                    <div className="flex items-center gap-2 px-1">
                        <Type className="w-3.5 h-3.5 text-blue-500" />
                        <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            Evaluation Source
                        </label>
                    </div>
                    <Card className="bg-neutral-900/40 border-neutral-800 p-4 space-y-4 shadow-inner overflow-hidden">
                        <TemplateTextarea
                            label="Variable Path"
                            value={config.input}
                            variables={availableVariables}
                            onChange={(val) => handleChange("input", val)}
                            placeholder="{{trigger.body.type}}"
                            className="min-h-[80px] bg-black/40 border-neutral-800 font-mono text-[11px]"
                        />
                        <div className="space-y-2.5">
                            <p className="text-[9px] uppercase font-bold text-neutral-600 tracking-tight">Input Pre-processing</p>
                            <div className="flex flex-wrap gap-1.5">
                                {TRANSFORMS.map(t => (
                                    <Badge
                                        key={t}
                                        onClick={() => handleChange("inputTransforms", toggleTransform(config.inputTransforms, t))}
                                        className={cn(
                                            "cursor-pointer text-[9px] px-2.5 py-0.5 transition-all border select-none",
                                            config.inputTransforms.includes(t)
                                                ? "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                                                : "bg-neutral-950 text-neutral-500 border-neutral-800 hover:border-neutral-700"
                                        )}
                                    >
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </Card>
                </section>

                {/* BRANCHING RULES SECTION */}
                <section className="flex-1 flex flex-col min-h-0 space-y-3">
                    <div className="flex items-center justify-between px-1 shrink-0">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-3.5 h-3.5 text-neutral-500" />
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                Output Branches
                            </label>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addRule}
                            className="h-7 px-3 text-[10px] uppercase font-black border-neutral-800 bg-neutral-900/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-95"
                        >
                            <Plus className="w-3 h-3 mr-1.5" /> Add Case
                        </Button>
                    </div>

                    <ScrollArea className="flex-1 pr-4 -mr-4">
                        <div className="space-y-3 pb-8">
                            {config.rules.map((rule, index) => (
                                <Collapsible
                                    key={rule.id}
                                    open={openRules[rule.id]}
                                    onOpenChange={(val) => setOpenRules(prev => ({ ...prev, [rule.id]: val }))}
                                    className="group border border-neutral-800 bg-neutral-900/20 rounded-2xl overflow-hidden transition-all hover:border-neutral-700/80 shadow-sm"
                                >
                                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-neutral-800/30 transition-colors text-left">
                                        <div className="flex items-center gap-4">
                                            <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-600 group-hover:text-blue-400 transition-colors">
                                                <GripVertical className="w-3 h-3" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-neutral-200 leading-none mb-1.5">
                                                    {rule.label || `Case ${index + 1}`}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] h-4 font-black uppercase">
                                                        {rule.operator}
                                                    </Badge>
                                                    <span className="text-[10px] text-neutral-500 font-mono truncate max-w-[180px]">
                                                        {rule.operator === 'exists' ? 'VALUE_PRESENT' : (rule.value || 'undefined')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronDown className="w-4 h-4 text-neutral-700 group-data-[state=open]:rotate-180 transition-transform duration-300" />
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="border-t border-neutral-800/50 p-5 bg-black/40 space-y-5 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest px-1">Operator</label>
                                                <Select
                                                    value={rule.operator}
                                                    onValueChange={(val: any) => updateRule(rule.id, { operator: val })}
                                                >
                                                    <SelectTrigger className="h-10 text-[11px] bg-neutral-950 border-neutral-800 rounded-xl focus:ring-0">
                                                        <SelectValue placeholder="Select operator" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-neutral-900 border-neutral-800">
                                                        {OPERATORS.map((op) => (
                                                            <SelectItem key={op} value={op} className="text-[11px] text-white focus:bg-blue-500/10 focus:text-blue-400">
                                                                {op.toUpperCase()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest px-1">Target Value</label>
                                                <TemplateTextarea
                                                    label=""
                                                    value={rule.value}
                                                    disabled={rule.operator === "exists"}
                                                    variables={availableVariables}
                                                    onChange={(val) => updateRule(rule.id, { value: val })}
                                                    placeholder="Value..."
                                                    className="h-10 text-[11px] bg-neutral-950 border-neutral-800 rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2.5">
                                            <label className="text-[9px] uppercase font-bold text-neutral-600 tracking-widest px-1">Case Transforms</label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {TRANSFORMS.map(t => (
                                                    <Badge
                                                        key={t}
                                                        onClick={() => updateRule(rule.id, { transforms: toggleTransform(rule.transforms, t) })}
                                                        className={cn(
                                                            "cursor-pointer text-[9px] px-2.5 py-0.5 border transition-all select-none",
                                                            rule.transforms.includes(t)
                                                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                                : "bg-neutral-900 text-neutral-600 border-neutral-800 hover:border-neutral-700"
                                                        )}
                                                    >
                                                        {t}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-5 border-t border-neutral-800/50">
                                            <div className="space-y-1">
                                                <Input
                                                    value={rule.label}
                                                    onChange={(e) => updateRule(rule.id, { label: e.target.value })}
                                                    placeholder="Branch Alias..."
                                                    className="h-8 w-44 text-[10px] bg-transparent border-dashed border-neutral-800 focus:border-neutral-200/50 transition-all"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleChange("rules", config.rules.filter((r) => r.id !== rule.id))}
                                                className="h-8 px-3 text-[10px] font-bold text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 mr-2" /> Remove Case
                                            </Button>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}

                            {config.rules.length === 0 && (
                                <div className="py-12 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center space-y-3">
                                    <Split className="w-8 h-8 text-neutral-800" />
                                    <p className="text-[11px] text-neutral-600 font-medium italic">No output branches defined.</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </section>
            </div>
        </SheetWrapper>
    );
}

export const DecisionNodeConfigSheet = memo(DecisionConfigSheet);