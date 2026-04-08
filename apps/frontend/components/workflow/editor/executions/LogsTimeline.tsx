"use client";

import { cn } from "@/lib/utils";
import {
    ChevronRight,
    Zap,
    Search,
    FileCode2,
    Package,
    Mail,
    Workflow,
    Activity,
    Clock
} from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ExecutionDataInspector } from "./ExecutionDataInspector";
import {memo, useMemo} from "react";
import {ExecutionLog} from "@/types";
import {nanoid} from "nanoid";

const nodeIconMap: Record<string, any> = {
    webhook: Zap,
    filter: Search,
    http_request: FileCode2,
    function: Package,
    send_email: Mail,
};

function Logs({ logs, title }: { logs: Record<string, ExecutionLog>, title?: string }) {

    const formatedLogs = useMemo(() => {
        return Object.values(logs);
    }, [logs])

    return (
        <div className="space-y-4 w-full bg-black rounded-xl p-4 border border-neutral-800/80">
            <header className="flex items-center gap-2 px-1 mb-6">
                <Activity className="w-3.5 h-3.5 text-neutral-500" />
                <span className="text-[10px] font-bold uppercase text-neutral-500 tracking-[0.2em]">
                    {title ?? "Sequence Telemetry"}
                </span>
            </header>

            <Accordion type="single" collapsible className="space-y-3">
                {formatedLogs.map((log) => {
                    const NodeIcon = nodeIconMap[log.nodeType] || Workflow;
                    const isError = log.status === "error";

                    return (
                        <AccordionItem
                            key={log.id ?? nanoid()}
                            value={log.id}
                            className="border border-neutral-800 bg-neutral-900/40 data-[state=open]:border-white/20 data-[state=open]:bg-white/[0.02]  rounded-xl overflow-hidden px-0 transition-all"
                        >
                            <AccordionTrigger className="hover:no-underline px-4 py-4 group transition-all">
                                <div className="flex items-center gap-4 w-full text-left">
                                    {/* Icon with Status Indicator */}
                                    <div className="relative shrink-0">
                                        <div className="p-2.5 bg-neutral-950 rounded-lg border border-white/5 group-hover:border-white/10 transition-colors">
                                            <NodeIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <div className={cn(
                                            "absolute -top-1 -right-3! w-2.5 h-2.5 rounded-full border-2 border-neutral-900",
                                            isError ? "bg-red-500" : "bg-emerald-500"
                                        )} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-bold uppercase text-neutral-500 tracking-widest mb-0.5 opacity-70">
                                            {log.nodeType}
                                        </p>
                                        <h4 className="text-sm font-medium text-white tracking-tight truncate">
                                            {log.nodeLabel}
                                        </h4>
                                    </div>

                                    <div className="mr-2 flex items-center gap-3 shrink-0">
                                        <div className="flex items-center gap-1.5 text-neutral-600">
                                            <Clock className="w-3 h-3" />
                                            <span className="text-[10px] font-mono">{log.durationMs}ms</span>
                                        </div>
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent className="px-4 pb-4 border-t border-neutral-800/50 bg-neutral-950/40">
                                <div className="pt-5 animate-in fade-in slide-in-from-top-2 max-w-[700px] duration-300">
                                    <ExecutionDataInspector selectedLog={log} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}

export const LogTimeline = memo(Logs);