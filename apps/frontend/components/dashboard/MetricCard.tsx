import { cn } from '@/lib/utils';

export function MetricCard({
  title,
  value,
  subtitle,
  className,
}: {
  title: string;
  value: number;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'bg-muted/70 transition-200 min-h-[140px] rounded-2xl border border-white/13 p-5 backdrop-blur-xl hover:bg-white/[0.10]',
        className
      )}
    >
      <p className="text-sm text-white/60">{title}</p>
      <h2 className="mt-2 text-2xl font-semibold">{value}</h2>
      {subtitle && <p className="mt-1 text-xs text-white/40">{subtitle}</p>}
    </div>
  );
}
