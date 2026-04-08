"use client";

import React, {useMemo} from "react";
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    ShieldCheck,
    Activity,
    Zap
} from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import { EditorPanel } from "./EditorPanel";
import { useValidation } from "@/hooks/useValidation";
import { cn } from "@/lib/utils";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";

export function WorkflowInspector() {
    const { errors, isValid, isNodeValid } = useValidation();
    const { isWorkflowInspectorOpen, setIsWorkflowInspectorOpen } = useWorkflowEditor();

    const nodeIdsWithErrors = useMemo(() => Object.keys(errors), [errors]);

    return (
        <EditorPanel
            open={isWorkflowInspectorOpen}
            onOpenChange={setIsWorkflowInspectorOpen}
            title="Integrity Monitor"
            description="Real-time heuristic analysis of the neuron editor."
            icon={<Activity className="w-5 h-5" />}
            position="Top Right"
            width="w-[450px]"
            className={"h-[90dvh]!"}
        >
            <div className="space-y-6 p-2">
                {/* High-Level Status Summary */}
                <div className={cn(
                    "relative overflow-hidden p-4 rounded-2xl border transition-all duration-500",
                    isValid
                        ? "bg-white/[0.02] border-emerald-500/20"
                        : "bg-white/[0.02] border-amber-500/20"
                )}>
                    {/* Subtle accent glow */}
                    <div className={cn(
                        "absolute -top-10 -right-10 w-24 h-24 blur-[50px] rounded-full opacity-10",
                        isValid ? "bg-emerald-500" : "bg-amber-500"
                    )} />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-xl border",
                            isValid
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        )}>
                            {isValid ? <ShieldCheck size={20} /> : <Zap size={20} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-[13px] font-semibold text-neutral-100 tracking-tight">
                                {isValid ? "Graph Verified" : "Logic Anomalies Detected"}
                            </h4>
                            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                                {isValid
                                    ? "All neural pathways are optimized and ready for deployment."
                                    : `${nodeIdsWithErrors.length} nodes require configuration adjustments to stabilize.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Detailed Diagnostics List */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">
                            Neural Diagnostics
                        </p>
                        {nodeIdsWithErrors.length > 0 && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 border border-neutral-700 font-mono">
                                {nodeIdsWithErrors.length} ISSUES
                            </span>
                        )}
                    </div>

                    {nodeIdsWithErrors.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6 text-neutral-700" />
                            </div>
                            <p className="text-[11px] text-neutral-500 font-medium italic">
                                Logic is sound. No anomalies found.
                            </p>
                        </div>
                    ) : (
                        nodeIdsWithErrors.map((nodeId) => {
                            const nodeDiagnostic = errors[nodeId];
                            const hasCritical = !isNodeValid(nodeId);

                            return (
                                <Collapsible key={nodeId} className="group border border-neutral-800 bg-neutral-900/40 rounded-xl data-[state=open]:border-white/20 data-[state=open]:bg-white/[0.02] hover:border-neutral-700 hover:bg-neutral-800/40">
                                    <CollapsibleTrigger className="w-full flex items-center justify-between p-3.5 rounded-xl  border border-neutral-800/50  transition-all text-left">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                                                hasCritical ? "bg-red-500 shadow-red-500/20" : "bg-amber-400 shadow-amber-400/20"
                                            )} />
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-semibold text-neutral-200 block truncate max-w-[200px]">
                                                    {nodeDiagnostic?.meta?.label || "Untitled Node"}
                                                </span>
                                                <span className="text-[9px] text-neutral-600 font-mono opacity-60">
                                                    ID: {nodeId.split('-')[0]}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-neutral-700 font-bold group-data-[state=open]:hidden">
                                                {nodeDiagnostic.errors.length}
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-neutral-600 group-data-[state=open]:rotate-90 transition-transform" />
                                        </div>
                                    </CollapsibleTrigger>

                                    <CollapsibleContent className="space-y-2 bg-neutral-950/50 animate-in slide-in-from-top-1 duration-200">
                                        {nodeDiagnostic.errors.map((error, idx) => (
                                            <div
                                                key={idx}
                                                className="flex gap-3 p-3 rounded-md  border border-white/[0.02]"
                                            >
                                                <div className="mt-0.5 shrink-0">
                                                    {error.level === 'error' ? (
                                                        <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />
                                                    ) : (
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80" />
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-[11px] text-neutral-300 leading-normal font-medium">
                                                        {error.message}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] text-neutral-600 uppercase tracking-widest font-bold">
                                                            Scope: {error.field}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>
                            );
                        })
                    )}
                </div>
            </div>
        </EditorPanel>
    );
}