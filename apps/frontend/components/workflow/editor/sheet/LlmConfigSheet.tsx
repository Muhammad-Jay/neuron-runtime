"use client";

import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
    Brain,
    ShieldCheck,
    Settings2,
    Sparkles,
    Terminal,
    Scale,
    Info,
    Braces,
    ExternalLink,
    Zap, Maximize2, Cpu
} from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { getAvailableUpstreamNodes } from "@/lib/utils";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {PromptOrchestrator} from "@/components/workflow/editor/sheet/PromptOrchestrator";
import {LLMNodeConfig} from "@neuron/shared";
import {SchemaDialog} from "@/components/workflow/editor/dialog/SchemaDialog";

const LLM_PROVIDERS = [
    { label: "OpenAI", value: "openai", icon: "🟢" },
    { label: "Anthropic", value: "anthropic", icon: "🟠" },
    { label: "Google Gemini", value: "gemini", icon: "🔵" },
    { label: "Ollama (Local)", value: "ollama", icon: "🦙" },
];

const LLM_MODELS: Record<string, { label: string; value: string }[]> = {
    openai: [
        { label: "GPT-4o", value: "gpt-4o" },
        { label: "GPT-4o Mini", value: "gpt-4o-mini" },
    ],
    anthropic: [
        { label: "Claude 3.5 Sonnet", value: "claude-3-5-sonnet-20240620" },
    ],
    gemini: [
        { label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
    ],
    ollama: [
        { label: "Llama 3 (8B)", value: "llama3" },
        { label: "Mistral", value: "mistral" },
    ]
};

export function LLMNodeConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen: (open: boolean) => void }) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    const [provider, setProvider] = useState<string>(node.data?.provider ?? "openai");
    const [config, setConfig] = useState<LLMNodeConfig>({
        provider: node.data?.provider ?? "openai",
        model: "gpt-4o",
        systemPrompt: "",
        userPrompt: "",
        temperature: 0.7,
        outputSchema: node.data?.outputSchema ?? "",
        maxTokens: 2048,
        jsonMode: false,
        apiKey: "{{Vault.OPENAI_API_KEY}}",
        ...node.data,
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

    const handleProviderChange = (val: string) => {
        setProvider(val);
        setConfig(prev => ({
            ...prev,
            provider: val,
            model: LLM_MODELS[val]?.[0]?.value || ""
        }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            nodeId={node.id}
            title="AI Brain Configuration"
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full overflow-hidden">

                {/* STATUS SUB-HEADER */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Brain className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Node Type: Inference</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-neutral-800 text-neutral-500 uppercase tracking-tight">
                        Aggregator Node
                    </Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">

                        {/* SECTION 1: SYSTEM TOPOLOGY (Provider & Model) */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-blue-500/10 rounded-md">
                                    <Settings2 className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">System Topology</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">AI Provider</label>
                                    <Select value={provider} onValueChange={handleProviderChange}>
                                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-xs h-9 focus:ring-blue-500/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-950 border-neutral-800">
                                            {LLM_PROVIDERS.map((p) => (
                                                <SelectItem key={p.value} value={p.value} className="text-xs">
                                                    <span className="mr-2">{p.icon}</span> {p.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">Model Profile</label>
                                    <Select value={config.model} onValueChange={(val) => handleChange("model", val)}>
                                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-xs h-9 focus:ring-blue-500/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-950 border-neutral-800">
                                            {LLM_MODELS[provider]?.map((m) => (
                                                <SelectItem key={m.value} value={m.value} className="text-xs">{m.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1 flex items-center gap-1.5">
                                        <ShieldCheck className="w-3 h-3 text-emerald-500" /> API Gateway Credentials
                                    </label>
                                    <Input
                                        value={config.apiKey}
                                        onChange={(e) => handleChange("apiKey", e.target.value)}
                                        className="bg-black/60 border-neutral-800 text-xs h-9 focus:border-neutral-500/50"
                                        placeholder="{{Vault.OPENAI_API_KEY}}"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: HYPERPARAMETERS (Temp, Tokens, JSON) */}
                        <div className="space-y-4 pt-4 border-t border-neutral-900">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-amber-500/10 rounded-md">
                                    <Scale className="w-3.5 h-3.5 text-amber-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Hyperparameters</h4>
                            </div>

                            <div className="space-y-6 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                {/* Temperature */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-[10px] font-bold text-neutral-400">Temperature</label>
                                        <span className="text-xs font-mono text-white bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">
                                            {config.temperature.toFixed(1)}
                                        </span>
                                    </div>
                                    <Slider
                                        value={[config.temperature]}
                                        max={1}
                                        step={0.1}
                                        onValueChange={([val]) => handleChange("temperature", val)}
                                        className="py-2"
                                    />
                                    <div className="flex justify-between text-[9px] text-neutral-600 font-mono tracking-wider">
                                        <span>Precise (0.0)</span>
                                        <span>Creative (1.0)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-400 ml-1">Max Tokens</label>
                                        <Input
                                            type="number"
                                            value={config.maxTokens}
                                            onChange={(e) => handleChange("maxTokens", Number(e.target.value))}
                                            className="bg-black/60 border-neutral-800 text-xs h-9"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-400 ml-1">Structured Output</label>
                                        <div className="flex items-center justify-between h-9 bg-black/60 border border-neutral-800 rounded-lg px-3">
                                            <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                                                <Braces className="w-3 h-3" /> JSON Mode
                                            </span>
                                            <Switch
                                                checked={config.jsonMode}
                                                onCheckedChange={(checked) => handleChange("jsonMode", checked)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Conditional Schema Builder */}
                                {config.jsonMode && (
                                    <SchemaDialog value={config.outputSchema ?? ""} onChange={handleChange}/>
                                )}
                            </div>
                        </div>

                        {/* SECTION: PROMPT MODAL TRIGGER */}
                        <div className="space-y-4 pt-4 border-t border-neutral-900">
                            <div className="flex items-center gap-2 mb-2 px-1">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Execution Logic</h4>
                            </div>

                            {/* Using the new component */}
                            <PromptOrchestrator
                                systemPrompt={config.systemPrompt}
                                userPrompt={config.userPrompt}
                                variables={availableVariables}
                                onUpdate={handleChange}
                                modelName={config.model}
                            />
                        </div>

                        {/* HELPER FOOTER BOX */}
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4 flex gap-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg h-fit">
                                <Info className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-neutral-300">Context Window Compression Enabled</p>
                                <p className="text-[10px] text-neutral-500 leading-normal">
                                    The active node automatically shrinks prompt lengths to save on cost. Access upstream objects using the <code className="text-purple-400 bg-purple-400/5 px-1 rounded">{"{{node_id}}"}</code> token.
                                </p>
                                <button className="flex items-center gap-1 text-[10px] text-blue-500 font-medium pt-1 hover:underline">
                                    View latency benchmarks <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* BOTTOM ACTION BUTTONS */}
                <div className="p-4 bg-neutral-900/40 border-t border-neutral-800 flex items-center justify-between">
                    <button className="text-[10px] text-neutral-500 hover:text-neutral-300 font-medium transition-colors">
                        Restore Model Defaults
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] text-neutral-600 flex items-center gap-1 italic">
                            Running auto-evaluation
                        </span>
                        {/* ACCENT WHITE BUTTONS */}
                        <button className="h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2">
                            <Zap className="w-3.5 h-3.5 fill-black" /> Evaluate Unit
                        </button>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}