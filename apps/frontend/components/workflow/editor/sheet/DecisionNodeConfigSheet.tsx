"use client";

import React, { useState, useEffect } from "react";
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
import { getAvailableUpstreamNodes } from "@/lib/utils";

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
import { cn } from "@/lib/utils";
import FormField from "@/components/FormField";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

const TRANSFORMS = ["toLowerCase", "toUpperCase", "trim", "toString", "toNumber"];
const OPERATORS = ["==", "!=", ">", "<", "includes", "exists"];

interface DecisionNodeConfig {
    input: string;
    inputTransforms: string[];
    rules: any[];
}

export function DecisionNodeConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen?: (open: boolean) => void }) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    // Internal state for immediate UI feedback
    const [config, setConfig] = useState<DecisionNodeConfig>({
        input: node.data.config?.input || "",
        inputTransforms: node.data.config?.inputTransforms || [],
        rules: node.data.config?.rules || []
    });

    const [openRules, setOpenRules] = useState<Record<string, boolean>>({});
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

    const handleChange = (key: keyof DecisionNodeConfig, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const addRule = () => {
        if (config.rules.length >= 5) return;
        const id = crypto.randomUUID();
        const newRule = {
            id,
            operator: "==",
            value: "",
            transforms: [],
            label: `Case ${config.rules.length + 1}`
        };
        handleChange("rules", [...config.rules, newRule]);
        setOpenRules(prev => ({ ...prev, [id]: true }));
    };

    const updateRule = (id: string, patch: any) => {
        const nextRules = config.rules.map((r) => r.id === id ? { ...r, ...patch } : r);
        handleChange("rules", nextRules);
    };

    const toggleTransform = (current: string[], t: string) =>
        current.includes(t) ? current.filter(x => x !== t) : [...current, t];

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            className="w-[600px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full">
                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Split className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-neutral-200">Decision Logic</h3>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Branching Controller</p>
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

                {/* CONTENT */}
                <div className="flex-1 flex flex-col min-h-0 px-6 py-4 space-y-6">

                    {/* PINNED INPUT SECTION */}
                    <section className="space-y-3 shrink-0">
                        <div className="flex items-center gap-2 px-1">
                            <Type className="w-3 h-3 text-blue-500" />
                            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                Global Input Source
                            </label>
                        </div>
                        <Card className="bg-neutral-900/40 border-neutral-800 p-4 space-y-4 shadow-inner">
                            <TemplateTextarea
                                label=""
                                value={config.input}
                                variables={availableVariables}
                                onChange={(val) => handleChange("input", val)}
                                placeholder="{{node_id.output_path}}"
                                className="min-h-[80px] bg-black/40 border-neutral-800"
                            />
                            <div className="space-y-2">
                                <p className="text-[9px] uppercase font-bold text-neutral-600 tracking-tight">Pre-process Input</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {TRANSFORMS.map(t => (
                                        <Badge
                                            key={t}
                                            onClick={() => handleChange("inputTransforms", toggleTransform(config.inputTransforms, t))}
                                            className={cn(
                                                "cursor-pointer text-[9px] px-2 py-0.5 transition-all border",
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

                    {/* SCROLLABLE RULES SECTION */}
                    <section className="flex-1 flex flex-col min-h-0 space-y-3">
                        <div className="flex items-center justify-between px-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <Settings2 className="w-3 h-3 text-neutral-500" />
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                                    Branching Rules
                                </label>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={addRule}
                                className="h-7 px-3 text-[10px] uppercase font-bold border-neutral-800 bg-neutral-900/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30"
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
                                        className="group border border-neutral-800 bg-neutral-900/20 rounded-xl overflow-hidden transition-all hover:border-neutral-700"
                                    >
                                        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-neutral-800/30 transition-colors text-left">
                                            <div className="flex items-center gap-4">
                                                <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded-md text-neutral-600 group-hover:text-blue-400 transition-colors">
                                                    <GripVertical className="w-3 h-3" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-mono text-neutral-300 leading-none mb-1">
                                                        {rule.label || `Case ${index + 1}`}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter">
                                                            {rule.operator}
                                                        </span>
                                                        <span className="text-[9px] text-neutral-500 font-mono truncate max-w-[150px]">
                                                            {rule.operator === 'exists' ? 'EXISTS' : (rule.value || 'undefined')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronDown className="w-4 h-4 text-neutral-700 group-data-[state=open]:rotate-180 transition-transform" />
                                        </CollapsibleTrigger>

                                        <CollapsibleContent className="border-t border-neutral-800/50 p-5 bg-black/40 space-y-5">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest">Operator</label>

                                                    <Select
                                                        value={rule.operator}
                                                        onValueChange={(val: string) => updateRule(rule.id, { operator: val })}
                                                    >
                                                        <SelectTrigger className="w-full ">
                                                            <SelectValue
                                                                title={rule.operator}
                                                                className={cn('text-xs text-secondary-foreground font-medium')}
                                                                placeholder={"Select operator"} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {OPERATORS.map((operator) => (
                                                                <SelectItem
                                                                    className={cn('text-xs text-secondary-foreground font-medium')}
                                                                    key={operator} value={operator}>
                                                                    {operator}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest">Target Value</label>

                                                    <TemplateTextarea
                                                        label=""
                                                        value={rule.value}
                                                        disabled={rule.operator === "exists"}
                                                        variables={availableVariables}
                                                        onChange={(val) => updateRule(rule.id, { value: val })}
                                                        placeholder="Compare with..."
                                                        className="h-9 text-xs bg-neutral-950 border-neutral-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] uppercase font-bold text-neutral-500 tracking-widest">Case Transforms</label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {TRANSFORMS.map(t => (
                                                        <Badge
                                                            key={t}
                                                            onClick={() => updateRule(rule.id, { transforms: toggleTransform(rule.transforms, t) })}
                                                            className={cn(
                                                                "cursor-pointer text-[9px] px-2.5 py-0.5 border transition-all",
                                                                rule.transforms.includes(t)
                                                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                                                    : "bg-neutral-900 text-neutral-600 border-neutral-800"
                                                            )}
                                                        >
                                                            {t}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
                                                <Input
                                                    value={rule.label}
                                                    onChange={(e) => updateRule(rule.id, { label: e.target.value })}
                                                    placeholder="Branch Name (e.g. On Success)"
                                                    className="h-7 w-48 text-[10px] bg-transparent border-dashed border-neutral-800"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleChange("rules", config.rules.filter((r) => r.id !== rule.id))}
                                                    className="h-7 px-3 text-[10px] text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1.5" /> Delete
                                                </Button>
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ))}
                            </div>
                        </ScrollArea>
                    </section>
                </div>
            </div>
        </SheetWrapper>
    );
}