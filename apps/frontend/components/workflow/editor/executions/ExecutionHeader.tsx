import { ArrowLeft, Calendar, Timer, Hash, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {cn} from "@/lib/utils";

export function ExecutionHeader({ execution, onBack }: { execution: any; onBack: () => void }) {
    const isSuccess = execution?.status === "success";
    const StatusIcon = execution?.status === "running" ? Loader2 : isSuccess ? CheckCircle2 : XCircle;

    return (
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-5 mb-8">
                <button
                    onClick={onBack}
                    className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                </button>
                <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase text-neutral-500 tracking-[0.3em] mb-1">Sequence Report</p>
                    <h2 className="text-xl font-semibold text-white tracking-tight">Run {execution?.id.slice(0, 8).toUpperCase()}</h2>
                </div>
                <div className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border",
                    isSuccess ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-red-500/5 border-red-500/20 text-red-400"
                )}>
                    <StatusIcon className={cn("w-4 h-4", execution?.status === "running" && "animate-spin")} />
                    <span className="text-sm font-medium capitalize">{execution?.status}</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <Stat icon={Calendar} label="Timestamp" value={format(new Date(execution?.startedAt), "MMM d, HH:mm:ss")} />
                <Stat icon={Timer} label="Duration" value={`${execution?.durationMs || 0}ms`} />
                <Stat icon={Hash} label="Version" value={execution?.workflowVersionId?.slice(0, 8) || "Direct Run"} />
            </div>
        </div>
    );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-500">
                <Icon className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">{label}</span>
            </div>
            <p className="text-sm font-medium text-white">{value}</p>
        </div>
    );
}