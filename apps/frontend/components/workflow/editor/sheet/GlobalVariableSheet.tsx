"use client";

import React, { useState, useMemo, ReactNode } from "react";
import {
    Plus,
    Trash2,
    Variable,
    Info,
    Copy,
    Check,
    Hash,
    Type,
    Save,
    Search,
    Edit3,
    X,
    Database
} from "lucide-react";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {GlobalVariable} from "@neuron/shared";

export function GlobalVariablesSheet() {
    const { editorState, workflowEditorDispatch, isGlobalVariableSheetOpen, setIsGlobalVariableSheetOpen } = useWorkflowEditor();

    // variables is now Record<string, GlobalVariable>
    const variables = useMemo(() => {
        return editorState.globalVariables ?? {}
    }, [editorState.globalVariables]);

    const [draft, setDraft] = useState({ key: "", value: "" });
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSaveNew = () => {
        if (!draft.key.trim()) return;

        const formattedKey = draft.key.toUpperCase().replace(/\s+/g, '_');

        // Create the full GlobalVariable object
        const newVariable: GlobalVariable = {
            id: crypto.randomUUID(), // Temporary ID for frontend state
            key: formattedKey,
            value: draft.value,
            type: "string", // You can add logic later to detect 'json' or 'number'
            createdAt: new Date(),
            updatedAt: new Date()
        };

        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS,
            payload: { ...variables, [formattedKey]: newVariable }
        });

        setDraft({ key: "", value: "" });
    };

    const handleCommitEdit = (key: string) => {
        const existingVar = variables[key];
        if (!existingVar) return;

        const updatedVariable: GlobalVariable = {
            ...existingVar,
            value: editValue,
            updatedAt: new Date()
        };

        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS,
            payload: { ...variables, [key]: updatedVariable }
        });
        setEditingKey(null);
    };

    const handleDelete = (key: string) => {
        const newVars = { ...variables };
        delete newVars[key];
        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS,
            payload: newVars
        });
    };

    const copyToClipboard = (key: string) => {
        navigator.clipboard.writeText(`{{Global.${key}}}`);
        setCopiedKey(key);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const filteredEntries = useMemo(() => {
        return Object.entries(variables).filter(([k]) =>
            k.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [variables, searchQuery]);

    return (
        <SheetWrapper
            open={isGlobalVariableSheetOpen}
            onOpenChange={setIsGlobalVariableSheetOpen}
            title="Global Intelligence Registry"
            className="w-[600px]! p-0! bg-neutral-950/98 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full">

                {/* --- 1. REGISTRATION PANEL --- */}
                <div className="p-6 space-y-4 border-b border-neutral-900 bg-neutral-900/10">
                    <div className="flex items-center gap-2 mb-2">
                        <Plus className="w-3.5 h-3.5 text-blue-500" />
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">Register New Constant</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2 bg-black/40 border border-neutral-800 rounded-lg px-3 focus-within:border-blue-500/40 transition-all">
                            <Type className="w-3.5 h-3.5 text-neutral-600" />
                            <Input
                                placeholder="VARIABLE_NAME"
                                value={draft.key}
                                onChange={(e) => setDraft(p => ({ ...p, key: e.target.value }))}
                                className="border-none bg-transparent h-9 text-xs font-mono font-bold text-blue-400 focus-visible:ring-0 placeholder:text-neutral-700 uppercase"
                            />
                        </div>
                        <Textarea
                            placeholder="Value or JSON payload..."
                            value={draft.value}
                            onChange={(e) => setDraft(p => ({ ...p, value: e.target.value }))}
                            className="bg-black/40 border-neutral-800 min-h-[100px] max-h-[250px] text-xs font-mono focus-visible:ring-0 focus:border-blue-500/40 text-neutral-300 resize-none p-3"
                        />
                        <Button
                            onClick={handleSaveNew}
                            disabled={!draft.key}
                            className="bg-white text-black hover:bg-neutral-200 h-9 font-bold uppercase tracking-widest text-[10px]"
                        >
                            Commit to Registry
                        </Button>
                    </div>
                </div>

                {/* --- 2. SEARCH & STATS --- */}
                <div className="px-6 py-4 flex items-center justify-between bg-neutral-950/50">
                    <div className="flex items-center gap-2">
                        <Database className="w-3 h-3 text-neutral-500" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Active Registry</span>
                        <span className="text-[9px] font-mono text-neutral-700 ml-2">Total: {Object.keys(variables).length}</span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-700" />
                        <Input
                            placeholder="Search keys..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-7 w-32 bg-neutral-900 border-neutral-800 text-[10px] pl-7 focus-visible:ring-0"
                        />
                    </div>
                </div>

                {/* --- 3. LIST AREA --- */}
                <ScrollArea className="flex-1 px-6">
                    <div className="space-y-2 pb-10 mt-4">
                        {filteredEntries.map(([key, variable]) => (
                            <div key={variable.id} className={cn(
                                "group flex flex-col p-3 border transition-all rounded-xl",
                                editingKey === key
                                    ? "bg-blue-500/5 border-blue-500/30"
                                    : "bg-neutral-900/20 border-neutral-800/40 hover:border-neutral-700"
                            )}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Badge className="bg-blue-500/10 text-blue-400 border-none font-mono text-[10px] py-0.5 shrink-0">
                                            {key}
                                        </Badge>
                                        {editingKey !== key && (
                                            <span className="text-[11px] font-mono text-neutral-500 truncate max-w-[250px]">
                                                {variable.value || "empty"}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        {editingKey === key ? (
                                            <div className="flex items-center gap-1">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-500" onClick={() => handleCommitEdit(key)}><Check className="w-3.5 h-3.5" /></Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-500" onClick={() => setEditingKey(null)}><X className="w-3.5 h-3.5" /></Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-500 hover:text-white" onClick={() => copyToClipboard(key)}>
                                                    {copiedKey === key ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-500 hover:text-blue-400" onClick={() => { setEditingKey(key); setEditValue(variable.value); }}>
                                                    <Edit3 className="w-3 h-3" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-7 w-7 text-neutral-500 hover:text-red-500" onClick={() => handleDelete(key)}>
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {editingKey === key && (
                                    <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <Textarea
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                            className="min-h-[100px] max-h-[200px] bg-black/40 border-neutral-800 text-xs font-mono focus-visible:ring-0 focus:border-blue-500/30 p-3"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 bg-neutral-950 border-t border-neutral-900">
                    <div className="flex gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-neutral-500 leading-tight">
                            Global variables are accessible as <code className="text-blue-400">{"{{Global.KEY}}"}</code>. Values are stored as plain text but can be parsed as JSON in specialized nodes.
                        </p>
                    </div>
                </div>
            </div>
        </SheetWrapper>
    );
}

function Badge({ children, className }: { children: ReactNode, className?: string }) {
    return <span className={cn("px-1.5 rounded-md text-[9px] font-bold tracking-tight border", className)}>{children}</span>;
}