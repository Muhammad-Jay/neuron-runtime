'use client';

import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { DashboardChart } from '@/components/dashboard/DashboardChart';
import { ExecutionFeed } from '@/components/dashboard/ExecutionFeed';
import { MetricGrid } from '@/components/dashboard/MetricGrid';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Zap } from 'lucide-react';
import { LogTimeline } from '@/components/workflow/editor/executions/LogsTimeline';
import { ExecutionLoadingSkeleton } from '@/components/workflow/editor/executions/ExecutionLoadingSkeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const {
    metrics,
    executions,
    loading,
    getExecutionLogs,
    isLogsLoading,
    logs,
    currentExecId,
  } = useDashboard();

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-black p-8 font-sans text-white">
      {/* Header: System Identity */}
      <header className="mb-2 flex flex-col gap-1">
        <p className="flex items-center gap-2 text-xs text-neutral-500">
          <Zap size={12} className="text-primary fill-primary" />
          Real-time engine telemetry and process monitoring.
        </p>
      </header>

      {/* Top Stats Layer */}
      <MetricGrid metrics={metrics} />

      {/* Analysis Layer */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardChart data={executions} />
        </div>

        <div className="flex flex-col gap-4">
          <MetricCard
            title="Active Sessions"
            value={metrics?.running ?? 0}
            subtitle="Processes currently in-flight"
            className="h-full justify-center"
          />
          {/* Placeholder for future specific metric */}
          <div className="group flex h-full flex-col justify-end rounded-2xl border border-white/[0.05] bg-white/[0.01] p-6 transition-all hover:bg-white/[0.02]">
            <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
              Health Score
            </span>
            <span className="text-2xl font-light text-white">99.8%</span>
          </div>
        </div>
      </div>

      {/* Execution Stream Layer */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-bold tracking-[0.3em] text-neutral-500 uppercase">
            Recent Stream
          </h2>
          <span className="font-mono text-[9px] text-neutral-700">
            LIVE AUTO-REFRESH
          </span>
        </div>
        <div className="flex w-full flex-col justify-center gap-5 rounded-xl border-none md:h-[560px]! md:flex-row">
          <ExecutionFeed
            executions={executions}
            onClick={getExecutionLogs}
            logs={Object.entries(logs).length > 0}
            currentExecId={currentExecId}
            loading={loading}
          />

          {isLogsLoading ? (
            <ExecutionLoadingSkeleton />
          ) : (
            Object.entries(logs).length > 0 && (
              <ScrollArea className={'center h-full! w-full p-0 pr-3!'}>
                <LogTimeline logs={logs} title={'Execution Logs'} />
              </ScrollArea>
            )
          )}
        </div>
      </section>
    </div>
  );
}
