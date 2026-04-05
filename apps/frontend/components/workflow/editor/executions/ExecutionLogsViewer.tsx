"use client";

import {memo, useEffect, useMemo, useState} from "react";
import { Activity, Database } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { ExecutionHeader } from "@/components/workflow/editor/executions/ExecutionHeader";
import { LogTimeline } from "@/components/workflow/editor/executions/LogsTimeline";
import {ExecutionLoadingSkeleton} from "@/components/workflow/editor/executions/ExecutionLoadingSkeleton";

function ExecutionLogs({ executionId, onBack }: { executionId: string, onBack: () => void }) {
    const { getExecutionLogs, workflowEditorDispatch, editorState, logs, isLogsLoading } = useWorkflowEditor();

    // Get the execution metadata from your record state
    const execution = useMemo(() => editorState.runtime.executions[executionId], [editorState, workflowEditorDispatch])

    useEffect(() => {
        getExecutionLogs(executionId);
    }, [executionId]);


    return isLogsLoading ?  (<ExecutionLoadingSkeleton />) :(
        <div className="h-full flex flex-col overflow-hidden">
            {/* 1. Header with Back Button and Execution Stats */}
            <ExecutionHeader execution={execution} onBack={onBack} />

            <ScrollArea className="flex-1 px-1">
                <div className="grid grid-cols-[1fr,1.3fr] gap-6 items-start pb-10">

                    {/* 2. Left Side: The Step Timeline (Step 2 of your flow) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <Activity className="w-4 h-4 text-neutral-500" />
                            <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest">
                                Sequence Steps
                            </span>
                        </div>
                        <LogTimeline
                            logs={logs}
                        />
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

export const ExecutionLogsViewer = memo(ExecutionLogs)