'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Execution } from '@/types';
import { useMemo } from 'react';
import { format } from 'date-fns';

const chartConfig = {
  total: {
    label: 'Total Cycles',
    color: '#ffffff',
  },
  success: {
    label: 'Successful',
    color: '#10b981', // Emerald-500
  },
  failed: {
    label: 'Exceptions',
    color: '#ef4444', // Red-500
  },
} satisfies ChartConfig;

export function DashboardChart({ data }: { data: Execution[] }) {
  const chartData = useMemo(() => {
    const dailyStats: Record<
      string,
      { date: string; total: number; success: number; failed: number }
    > = {};

    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
    );

    sortedData.forEach((d) => {
      const dateKey = format(new Date(d.startedAt), 'MMM d');

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          total: 0,
          success: 0,
          failed: 0,
        };
      }

      dailyStats[dateKey].total += 1;
      if (d.status === 'success') {
        dailyStats[dateKey].success += 1;
      } else if (d.status === 'failed') {
        dailyStats[dateKey].failed += 1;
      }
    });

    return Object.values(dailyStats);
  }, [data]);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-muted/70 backdrop-blur-3xl transition-all duration-500 hover:border-white/[0.3]">
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h3 className="text-sm font-bold tracking-[0.2em] text-neutral-500 uppercase">
            Engine Throughput
          </h3>
          <p className="mt-1 text-[11px] text-neutral-600">
            Multi-dimensional execution telemetry.
          </p>
        </div>
        {/* Visual Legend */}
        <div className="flex items-center gap-4">
          <LegendItem color="bg-white" label="Total" />
          <LegendItem color="bg-emerald-500" label="Success" />
          <LegendItem color="bg-red-500" label="Failed" />
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[280px] w-full"
      >
        <AreaChart
          data={chartData}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-total)"
                stopOpacity={0.1}
              />
              <stop
                offset="95%"
                stopColor="var(--color-total)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="4 4"
            stroke="#ffffff05"
          />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
            stroke="#606060"
            fontSize={10}
            minTickGap={32}
          />

          <ChartTooltip
            cursor={{ stroke: '#ffffff10', strokeWidth: 1 }}
            content={
              <ChartTooltipContent
                indicator="line"
                className="border-white/10 bg-neutral-950"
              />
            }
          />

          {/* Overall Runs (White) */}
          <Area
            dataKey="total"
            type="monotone"
            fill="url(#fillTotal)"
            stroke="var(--color-total, #ffffff)"
            strokeWidth={2}
            dot={false}
          />

          {/* Successful Runs (Emerald) */}
          <Area
            dataKey="success"
            type="monotone"
            fill="transparent" // No fill for secondary lines to keep it clean
            stroke="var(--color-success, #10b981)"
            strokeWidth={2}
            dot={false}
          />

          {/* Error Runs (Red) */}
          <Area
            dataKey="failed"
            type="monotone"
            fill="transparent"
            stroke="var(--color-failed, #ef4444)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
      <span className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
        {label}
      </span>
    </div>
  );
}
