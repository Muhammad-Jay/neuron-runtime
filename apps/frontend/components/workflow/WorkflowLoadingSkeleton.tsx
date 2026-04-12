'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export const WorkflowLoadingSkeleton = () => {
    return (
        <div className="flex flex-1 flex-col gap-12 py-4">

            {/* 1. WORKSPACE GRID SKELETON (The 3-column top section) */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        {/* The Workspace Box (4:3 Aspect Ratio) */}
                        <div className="aspect-[4/3] w-full rounded-2xl bg-muted/30 border border-white/5 p-3">
                            {/* Inner 2x2 Mini-Grid Preview */}
                            <div className="grid grid-cols-2 gap-2 h-full">
                                <Skeleton className="rounded-lg bg-neutral-800/40" />
                                <Skeleton className="rounded-lg bg-neutral-800/40" />
                                <Skeleton className="rounded-lg bg-neutral-800/40" />
                                <Skeleton className="rounded-lg bg-neutral-800/40" />
                            </div>
                        </div>
                        {/* Label Placeholder at the bottom */}
                        <div className="flex items-center gap-2 px-1">
                            <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* 2. UNASSIGNED SECTION SKELETON */}
            <div className="mt-8">
                {/* Section Header Placeholder */}
                <Skeleton className="mb-6 h-4 w-40 opacity-50" />

                {/* Flat Grid (The 4-column bottom section) */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-3 rounded-xl bg-muted/30 p-4 border border-white/5 h-[160px]"
                        >
                            <div className="flex gap-3">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                            <div className="mt-auto flex gap-2">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};