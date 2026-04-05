"use client";

import React, { useState, useMemo } from "react";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { ExecutionLogsViewer } from "./ExecutionLogsViewer";
import { SheetWrapper } from "../SheetWrapper";
import { Activity, History } from "lucide-react";
import ExecutionCard from "@/components/workflow/editor/executions/ExecutionCard";

export function ExecutionHistorySheet() {
    const {
        editorState,
        isExecutionsSheetOpen,
        setIsExecutionsSheetOpen,
    } = useWorkflowEditor();

    const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

    // Transform Record<string, Execution> into sorted Array
    const sortedExecutions = useMemo(() => {
        const record = editorState.runtime.executions || {};
        return Object.values(record).sort(
            (a: any, b: any) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
        );
    }, [editorState.runtime.executions]);

    return (
        <SheetWrapper
            open={isExecutionsSheetOpen}
            onOpenChange={setIsExecutionsSheetOpen}
            title="Execution History"
            description="View past runs and detailed node-level execution logs."
            showContextSettings={false}
            className={"w-[800px]! p-0!"}
        >
            <div className="flex flex-col gap-4">
                {selectedExecutionId ? (
                    /* Drill-down into Logs */
                    <ExecutionLogsViewer
                        executionId={selectedExecutionId}
                        onBack={() => setSelectedExecutionId(null)}
                    />
                ) : (
                    /* High-level List */
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <History className="w-4 h-4 text-neutral-500" />
                            <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest">
                                Recent Sequences
                            </span>
                        </div>

                        {sortedExecutions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10">
                                <Activity className="w-8 h-8 text-neutral-800 mb-3" />
                                <p className="text-xs text-neutral-600">No telemetry data found.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {sortedExecutions.map((execution) => (
                                    <ExecutionCard
                                        key={execution.id}
                                        execution={execution}
                                        onClick={() => setSelectedExecutionId(execution.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </SheetWrapper>
    );
}