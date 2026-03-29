"use client";

import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
    Terminal,
    Settings2,
    Code2,
    Send,
    Info,
    Braces,
    ExternalLink,
    Zap,
    Layout,
    FileJson,
    Type,
    FileText,
    Globe,
    Database // Added for Schema icon
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const OUTPUT_FORMATS = [
    { label: "JSON Object", value: "json", icon: <FileJson className="w-3 h-3 text-blue-400" /> },
    { label: "Markdown Document", value: "markdown", icon: <FileText className="w-3 h-3 text-orange-400" /> },
    { label: "Plain Text", value: "text", icon: <Type className="w-3 h-3 text-neutral-400" /> },
    { label: "HTML Fragment", value: "html", icon: <Code2 className="w-3 h-3 text-emerald-400" /> },
];

const DELIVERY_MODES = [
    { label: "Synchronous Webhook Response", value: "webhook_response", description: "Return immediately to caller" },
    { label: "Asynchronous Stored Result", value: "stored_result", description: "Save to Lazarus logs" },
    { label: "Internal Notification", value: "notification", description: "Push to system UI" },
];

export function OutputNodeConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen: (open: boolean) => void }) {
    const { workflowEditorDispatch, editorState: { graph: { nodes, edges }} } = useWorkflowEditor();

    const [config, setConfig] = useState({
        label: "Final Data Output",
        template: "",
        format: {
            type: "json",
            minify: false,
            syntaxHighlight: true, // Field 1: Added missing field
        },
        delivery: {
            mode: "webhook_response",
            isPrimary: true,
            statusCode: 200,
        },
        includeMetadata: false,
        outputSchema: { type: "object", fields: [] }, // Field 2: Added missing field
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

    const handleNestedChange = (category: "format" | "delivery", key: string, value: any) => {
        setConfig(prev => ({
            ...prev,
            [category]: { ...prev[category as keyof typeof prev], [key]: value }
        }));
    };

    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpen}
            title="Final Output Configuration"
            className="w-[550px]! p-0! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full overflow-hidden">

                {/* STATUS SUB-HEADER */}
                <div className="flex items-center justify-between px-6 py-3 bg-neutral-900/40 border-b border-neutral-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-mono text-neutral-400">Node Type: Terminal Sink</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-500 uppercase tracking-tight bg-emerald-500/5">
                        Production Ready
                    </Badge>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-8">

                        {/* SECTION 1: SERIALIZATION */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-blue-500/10 rounded-md">
                                    <Settings2 className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Data Serialization</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">Output Format</label>
                                    <Select
                                        value={config.format.type}
                                        onValueChange={(val) => handleNestedChange("format", "type", val)}
                                    >
                                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-xs h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-950 border-neutral-800">
                                            {OUTPUT_FORMATS.map((f) => (
                                                <SelectItem key={f.value} value={f.value} className="text-xs">
                                                    <span className="flex items-center gap-2">
                                                        {f.icon} {f.label}
                                                    </span>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">UI & Processing</label>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between h-9 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3">
                                            <span className="text-[10px] text-neutral-400">Minify</span>
                                            <Switch
                                                checked={config.format.minify}
                                                onCheckedChange={(val) => handleNestedChange("format", "minify", val)}
                                                className="data-[state=checked]:bg-blue-500"
                                            />
                                        </div>
                                        {/* Added syntaxHighlight toggle */}
                                        <div className="flex items-center justify-between h-9 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3">
                                            <span className="text-[10px] text-neutral-400">Syntax Highlight</span>
                                            <Switch
                                                checked={config.format.syntaxHighlight}
                                                onCheckedChange={(val) => handleNestedChange("format", "syntaxHighlight", val)}
                                                className="data-[state=checked]:bg-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-500 ml-1">Output Identifier</label>
                                    <Input
                                        value={config.label}
                                        onChange={(e) => handleChange("label", e.target.value)}
                                        className="bg-black/60 border-neutral-800 text-xs h-9"
                                        placeholder="e.g., Send User Data to Frontend"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: DELIVERY PROTOCOL (Unchanged) */}
                        <div className="space-y-4 pt-4 border-t border-neutral-900">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-emerald-500/10 rounded-md">
                                    <Send className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Delivery Protocol</h4>
                            </div>

                            <div className="space-y-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-neutral-400 ml-1">Transmission Mode</label>
                                    <Select
                                        value={config.delivery.mode}
                                        onValueChange={(val) => handleNestedChange("delivery", "mode", val)}
                                    >
                                        <SelectTrigger className="bg-neutral-900/50 border-neutral-800 text-xs h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-neutral-950 border-neutral-800">
                                            {DELIVERY_MODES.map((m) => (
                                                <SelectItem key={m.value} value={m.value} className="text-xs">
                                                    {m.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-400 ml-1">Primary Result</label>
                                        <div className="flex items-center justify-between h-9 bg-black/60 border border-neutral-800 rounded-lg px-3">
                                            <span className="text-[10px] text-neutral-400">Main Result</span>
                                            <Switch
                                                checked={config.delivery.isPrimary}
                                                onCheckedChange={(val) => handleNestedChange("delivery", "isPrimary", val)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-neutral-400 ml-1">HTTP Status</label>
                                        <Input
                                            type="number"
                                            value={config.delivery.statusCode}
                                            onChange={(e) => handleNestedChange("delivery", "statusCode", Number(e.target.value))}
                                            className="bg-black/60 border-neutral-800 text-xs h-9 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: PAYLOAD CONSTRUCTION */}
                        <div className="space-y-4 pt-4 border-t border-neutral-900">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-purple-500/10 rounded-md">
                                    <Braces className="w-3.5 h-3.5 text-purple-500" />
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-200">Payload Construction</h4>
                            </div>

                            <div className="space-y-4 bg-neutral-900/20 p-4 rounded-xl border border-neutral-800/50">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-bold text-neutral-400 flex items-center gap-1.5 px-1">
                                        <Code2 className="w-3 h-3" /> Structure Template
                                    </label>
                                    <TemplateTextarea
                                        value={config.template}
                                        onChange={(val) => handleChange("template", val)}
                                        variables={availableVariables}
                                        className="bg-black/60 border-neutral-800 min-h-[180px] text-[12px] font-mono rounded-lg"
                                        placeholder={`{\n  "status": "success",\n  "data": {{upstream.output}}\n}`}
                                    />
                                </div>

                                {/* Added outputSchema input layer */}
                                <div className="space-y-2 pt-2 border-t border-neutral-800/50">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-1.5">
                                        <Database className="w-3 h-3" /> Type Contract (Schema)
                                    </label>
                                    <textarea
                                        value={JSON.stringify(config.outputSchema, null, 2)}
                                        onChange={(e) => {
                                            try { handleChange("outputSchema", JSON.parse(e.target.value)); } catch (err) {}
                                        }}
                                        className="w-full bg-black/40 border border-neutral-800 rounded-lg p-3 text-[10px] font-mono text-emerald-400 min-h-[80px]"
                                    />
                                </div>

                                <div className="flex items-center justify-between p-3 bg-black/40 border border-neutral-800 rounded-lg">
                                    <div className="space-y-0.5">
                                        <p className="text-[11px] font-bold text-neutral-200">Inject Telemetry</p>
                                        <p className="text-[9px] text-neutral-500">Include engine metadata in result.</p>
                                    </div>
                                    <Switch
                                        checked={config.includeMetadata}
                                        onCheckedChange={(val) => handleChange("includeMetadata", val)}
                                        className="data-[state=checked]:bg-purple-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FOOTER (Unchanged) */}
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 flex gap-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg h-fit">
                                <Globe className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[11px] font-semibold text-neutral-300">Synchronous Response Protocol</p>
                                <p className="text-[10px] text-neutral-500 leading-normal">
                                    When in <code className="text-emerald-400">webhook_response</code> mode, the engine will hold the HTTP connection open until this node completes its resolution.
                                </p>
                                <button className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium pt-1 hover:underline">
                                    Learn about edge-caching <ExternalLink className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                {/* BOTTOM ACTION BUTTONS (Unchanged) */}
                <div className="p-4 bg-neutral-900/40 border-t border-neutral-800 flex items-center justify-between">
                    <button className="text-[10px] text-neutral-500 hover:text-neutral-300 font-medium">
                        Clear Payload
                    </button>
                    <button className="h-9 px-4 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 fill-black" /> Deploy Sink
                    </button>
                </div>
            </div>
        </SheetWrapper>
    );
}