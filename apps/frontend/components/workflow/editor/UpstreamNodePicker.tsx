"use client";

import React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Zap, Globe, GitBranch, Code, Database,
    Lock, Loader2, Plus, ShieldCheck,
    Variable, Cpu, Layers, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVault } from "@/hooks/useVault";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";

const nodeIcons: Record<string, React.ReactNode> = {
    trigger: <Zap className="w-3 h-3 text-amber-500" />,
    httpNode: <Globe className="w-3 h-3 text-blue-400" />,
    condition: <GitBranch className="w-3 h-3 text-orange-400" />,
    transform: <Code className="w-3 h-3 text-purple-400" />,
    database: <Database className="w-3 h-3 text-emerald-400" />,
};

export function UpstreamNodePicker({
                                       nodes,
                                       onSelect,
                                       className
                                   }: {
    nodes: { id: string; type: string }[];
    onSelect: (id: string) => void;
    isLoading?: boolean;
    className?: string;
}) {
    const { secrets, isLoading: isSecretLoading } = useVault();
    const {
        editorState: { globalVariables },
        setIsGlobalVariableSheetOpen
    } = useWorkflowEditor();

    return (
        <Command
            id={"hide-scrollbar"}
            className={cn(
                "w-72 overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl rounded-md p-0.5 transition-all animate-in fade-in zoom-in-95 duration-100",
                className
            )}
        >
            {/* --- UTILITY HEADER --- */}
            <div className="flex items-center justify-between px-3 pt-3 pb-1 border-b border-neutral-900/50">
                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-500 flex items-center gap-1.5">
                    <Layers className="w-3 h-3" /> Data Context
                </span>
                <div className="flex gap-1">
                    <button
                        onClick={() => setIsGlobalVariableSheetOpen(true)}
                        className="p-1 hover:bg-neutral-800 rounded-md text-neutral-500 hover:text-white transition-colors"
                        title="New Variable"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <CommandInput
                placeholder="Search variables or nodes..."
                className="h-10 text-[11px] border-none focus:ring-0 placeholder:text-neutral-700"
            />

            <CommandList id={"hide-scrollbar"} className="max-h-64 no-scrollbar mask-fade-bottom py-1">
                <CommandEmpty className="py-6 text-center text-[10px] text-neutral-600 font-mono italic">
                    No results found in current context.
                </CommandEmpty>

                {isSecretLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-4 h-4 text-neutral-700 animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* 1. PRIORITY: UPSTREAM NODES */}
                        {nodes.length > 0 && (
                            <CommandGroup
                                id={"hide-scrollbar"}
                                heading={<div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-neutral-600 mb-1"><Cpu className="w-3 h-3" /> Upstream Nodes</div>}
                                className="px-2"
                            >
                                {nodes.map((node) => (
                                    <CommandItem
                                        key={node.id}
                                        onSelect={() => onSelect(node.id)}
                                        className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer rounded-lg aria-selected:bg-white/5 text-[11px] group"
                                    >
                                        <div className="shrink-0 w-6 h-6 rounded-md bg-neutral-900 flex items-center justify-center border border-neutral-800 group-aria-selected:border-neutral-700">
                                            {nodeIcons[node.type] || <Code className="w-3 h-3 text-neutral-500" />}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-neutral-300 font-medium truncate leading-tight">{node.id}</span>
                                            <span className="text-[9px] text-neutral-600 font-mono tracking-tighter uppercase">{node.type}</span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* 2. PRIORITY: GLOBAL REGISTRY */}
                        {globalVariables && Object.keys(globalVariables).length > 0 && (
                            <CommandGroup
                                id={"hide-scrollbar"}
                                heading={<div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-neutral-600 mt-2 mb-1"><Variable className="w-3 h-3" /> Global Variables</div>}
                                className="px-2"
                            >
                                {Object.entries(globalVariables).map(([key]) => (
                                    <CommandItem
                                        key={key}
                                        onSelect={() => onSelect(`Global.${key}`)}
                                        className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer rounded-lg aria-selected:bg-blue-500/10 text-[11px] group"
                                    >
                                        <div className="shrink-0 w-6 h-6 rounded-md bg-blue-500/5 flex items-center justify-center border border-blue-500/10 group-aria-selected:border-blue-500/30">
                                            <Variable className="w-3 h-3 text-blue-500" />
                                        </div>
                                        <span className="text-neutral-300 font-mono font-medium truncate tracking-tight">{key}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}

                        {/* 3. PRIORITY: SECRETS VAULT */}
                        {secrets.length > 0 && (
                            <CommandGroup
                                id={"hide-scrollbar"}
                                heading={<div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-neutral-600 mt-2 mb-1"><ShieldCheck className="w-3 h-3" /> Security Vault</div>}
                                className="px-2"
                            >
                                {secrets.map((v) => (
                                    <CommandItem
                                        key={v.id}
                                        onSelect={() => onSelect(`Vault.${v.name}`)}
                                        className="flex items-center gap-2.5 px-2 py-1.5 cursor-pointer rounded-lg aria-selected:bg-emerald-500/10 text-[11px] group"
                                    >
                                        <div className="shrink-0 w-6 h-6 rounded-md bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-aria-selected:border-emerald-500/30">
                                            <Lock className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <span className="text-neutral-300 font-medium truncate">{v.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </>
                )}
            </CommandList>

            {/* --- ACTION FOOTER --- */}
            <div className="p-2 bg-neutral-900/40 border-t border-neutral-900/50">
                <button
                    onClick={() => {/* Open Settings */}}
                    className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-neutral-800 rounded-md text-[10px] text-neutral-400 hover:text-white transition-all group"
                >
                    <div className="flex items-center gap-2">
                        <Plus className="w-3 h-3 text-neutral-600 group-hover:text-blue-400" />
                        <span>Add external data source...</span>
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                </button>
            </div>
        </Command>
    );
}