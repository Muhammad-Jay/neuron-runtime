"use client";

import { useDashboard } from "@/hooks/dashboard/useDashboard";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { ExecutionFeed } from "@/components/dashboard/ExecutionFeed";
import { MetricGrid } from "@/components/dashboard/MetricGrid";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Zap } from "lucide-react";
import {LogTimeline} from "@/components/workflow/editor/executions/LogsTimeline";
import {ExecutionLoadingSkeleton} from "@/components/workflow/editor/executions/ExecutionLoadingSkeleton";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function DashboardPage() {
    const { metrics, executions, loading, getExecutionLogs, isLogsLoading, logs, currentExecId } = useDashboard();

    return (
        <div className="flex flex-col gap-6 p-8 bg-black text-white min-h-screen font-sans">

            {/* Header: System Identity */}
            <header className="flex flex-col gap-1 mb-2">
                <h1 className="text-xl font-bold tracking-tight">Intelligence Dashboard</h1>
                <p className="text-xs text-neutral-500 flex items-center gap-2">
                    <Zap size={12} className="text-primary fill-primary" />
                    Real-time engine telemetry and process monitoring.
                </p>
            </header>

            {/* Top Stats Layer */}
            <MetricGrid metrics={metrics} />

            {/* Analysis Layer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <DashboardChart data={executions} />
                </div>

                <div className="flex flex-col gap-4">
                    <MetricCard
                        title="Active Sessions"
                        value={metrics?.running ?? 0}
                        subtitle="Processes currently in-flight"
                        className="h-full justify-center bg-primary/[0.02] border-primary/10"
                    />
                    {/* Placeholder for future specific metric */}
                    <div className="rounded-2xl border border-white/[0.05] bg-white/[0.01] p-6 flex flex-col justify-end h-full group hover:bg-white/[0.02] transition-all">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">Health Score</span>
                        <span className="text-2xl font-light text-white">99.8%</span>
                    </div>
                </div>
            </div>

            {/* Execution Stream Layer */}
            <section className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">Recent Stream</h2>
                    <span className="text-[9px] font-mono text-neutral-700">LIVE AUTO-REFRESH</span>
                </div>
                <div className="md:h-[560px]! w-full flex flex-col md:flex-row justify-center gap-5 border-none rounded-xl">
                    <ExecutionFeed
                        executions={executions}
                        onClick={getExecutionLogs}
                        logs={Object.entries(logs).length > 0}
                        currentExecId={currentExecId}
                        loading={loading} />

                    {isLogsLoading ?  (<ExecutionLoadingSkeleton />) : Object.entries(logs).length > 0 && (
                        <ScrollArea className={'w-full p-0 pr-3! center h-full!'}>
                            <LogTimeline logs={logs} title={"Execution Logs"}/>
                        </ScrollArea>
                    )}
                </div>
            </section>
        </div>
    );
}