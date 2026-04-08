// components/dashboard/execution-feed.tsx

import ExecutionCard from "@/components/workflow/editor/executions/ExecutionCard";
import {ExecutionLog} from "@/types";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";

export function ExecutionFeed({
                                  executions,
                                  loading,
                                  currentExecId,
    logs,
    onClick,
                              }: {
    executions: any[];
    loading: boolean;
    logs: boolean,
    currentExecId?: string,
    onClick: (executionId: string) => Promise<Record<string, ExecutionLog>>;
}) {
    return (
        <div
            className={cn("rounded-2xl md:h-[560px]! border overflow-hidden border-white/10 md:min-w-1/2 transition-200 bg-black! p-5 px-3.5! h-full",
                !logs && "w-full")}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                    Live Execution Stream
                </h3>
                {loading && (
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary animate-ping" />
                        <span className="text-[9px] text-neutral-600 font-mono">syncing</span>
                    </div>
                )}
            </div>

            <ScrollArea className={'w-full pb-7! pr-3 center h-full'}>
                <div className="space-y-3">
                    {loading ? (
                        // Show 5 skeletons while initial loading
                        <>
                            <ExecutionSkeleton />
                            <ExecutionSkeleton />
                            <ExecutionSkeleton />
                            <ExecutionSkeleton />
                            <ExecutionSkeleton />
                            <ExecutionSkeleton />
                            <ExecutionSkeleton />
                        </>
                    ) : executions.length > 0 ? (
                        executions.map((exec) => (
                            <ExecutionCard
                                key={exec.id}
                                currentExecId={currentExecId}
                                execution={exec}
                                onClick={() => onClick(exec.id)}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-2xl">
                            <p className="text-[11px] text-neutral-600 uppercase tracking-widest">No Active Telemetry</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}


export function ExecutionSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-white/[0.01] animate-pulse">
            <div className="flex items-center gap-4 flex-1">
                {/* Status Icon Placeholder */}
                <div className="w-8 h-8 rounded-lg bg-white/5" />

                <div className="space-y-2 flex-1">
                    {/* Execution Name Placeholder */}
                    <div className="h-3 w-32 bg-white/10 rounded-full" />
                    {/* Timestamp Placeholder */}
                    <div className="h-2 w-20 bg-white/5 rounded-full" />
                </div>
            </div>

            {/* Duration / Action Placeholder */}
            <div className="h-4 w-12 bg-white/5 rounded-md" />
        </div>
    );
}