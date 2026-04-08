import { CheckCircle2, CircleDashed, Clock, XCircle, ChevronRight } from "lucide-react";
import {cn} from "@/lib/utils";
import {formatDistanceToNow} from "date-fns";
import {Execution} from "@/types";

function ExecutionCard({ execution, onClick, currentExecId = "" }: { execution: Execution, onClick: () => void, currentExecId?: string }) {
    const statusConfig = {
        success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
        running: { icon: CircleDashed, color: "text-blue-400", bg: "bg-blue-400/10" },
        pending: { icon: Clock, color: "text-neutral-500", bg: "bg-neutral-500/10" },
    };

    const config = statusConfig[execution.status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <button
            onClick={onClick}
            className={cn("group w-full flex items-center justify-between p-4 rounded-xl border border-neutral-800/50 bg-neutral-900/20 hover:bg-neutral-900/40 hover:border-neutral-700 transition-all text-left",
               currentExecId === execution.id && "bg-neutral-900/40 border-neutral-700" )}
        >
            <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-lg border border-white/5", config.bg)}>
                    <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div>
                    <h4 className="text-sm font-medium text-white mb-0.5">
                        Execution <span className="text-neutral-500 font-mono text-xs ml-1">#{execution.id.slice(0, 8)}</span>
                    </h4>
                    <p className="text-xs text-neutral-500">
                        {formatDistanceToNow(new Date(execution.startedAt), { addSuffix: true })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {execution.finishedAt && (
                    <span className="text-[10px] font-mono text-neutral-500">
                        {Math.round((new Date(execution.finishedAt).getTime() - new Date(execution.startedAt).getTime()) / 1000)}s
                    </span>
                )}
                <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-white transition-colors" />
            </div>
        </button>
    );
}


export default ExecutionCard;