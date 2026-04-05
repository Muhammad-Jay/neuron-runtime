"use client";

import { ArrowLeft, Clock3, CalendarDays, Binary, CheckCircle2, XCircle, AlertCircle, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// statusColor: bg-white/[0.03] for neutral, colors for icons
const statusMap = {
    success: { label: "Sequence Complete", icon: CheckCircle2, color: "text-white" },
    failed: { label: "Sequence Terminated", icon: XCircle, color: "text-red-500" },
    running: { label: "Sequence Active", icon: Timer, color: "text-blue-400" },
    pending: { label: "Initializing...", icon: AlertCircle, color: "text-neutral-500" },
};

function ExecutionSummary({ execution, onBack }: { execution: any; onBack: () => void }) {
    const status = statusMap[execution.status as keyof typeof statusMap] || statusMap.pending;
    const Icon = status.icon;

    const duration = execution.finishedAt
        ? `${Math.round((new Date(execution.finishedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)}s`
        : "Active";

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all">
                    <ArrowLeft className="w-4 h-4 text-white" />
                </button>
                <div className="flex-1">
                    <p className="text-[11px] font-bold uppercase text-neutral-500 tracking-[0.2em] leading-tight mb-1">Execution Report</p>
                    <h2 className="text-xl font-semibold text-white tracking-tight">
                        #{execution.id.slice(0, 8).toUpperCase()}
                    </h2>
                </div>
                <div className={cn("flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/5 bg-white/[0.03]")}>
                    <Icon className={cn("w-4 h-4", status.color)} />
                    <span className="text-sm font-medium text-white">{status.label}</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 border-t border-neutral-800/50 pt-5">
                {[
                    { icon: CalendarDays, label: "Initiated", value: format(new Date(execution.startedAt), "MMM d, h:mm a") },
                    { icon: Clock3, label: "Total Duration", value: duration },
                    { icon: Binary, label: "Version ID", value: execution.workflowVersionId ? `#${execution.workflowVersionId.slice(0, 5)}` : "Draft v1" },
                    { icon: Timer, label: "Step Count", value: `${Object.keys(execution.logs || {}).length} Nodes` },
                ].map((stat, i) => {
                    const StatIcon = stat.icon;
                    return (
                        <div key={i} className="space-y-1.5 px-1">
                            <div className="flex items-center gap-2 text-neutral-500">
                                <StatIcon className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{stat.label}</span>
                            </div>
                            <p className="text-sm font-medium text-white pl-0.5">{stat.value}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}