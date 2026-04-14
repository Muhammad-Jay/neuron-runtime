import { MetricCard } from '@/components/dashboard/MetricCard';

export function MetricGrid({ metrics }: { metrics: any }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        title="Total Runs"
        value={metrics?.total ?? 0}
      />
      <MetricCard
        title="Successful Cycles"
        value={metrics?.success ?? 0}
        className="border-emerald-500/10"
      />
      <MetricCard
        title="System Exceptions"
        value={metrics?.failed ?? 0}
        className="border-red-500/10"
      />
    </div>
  );
}
