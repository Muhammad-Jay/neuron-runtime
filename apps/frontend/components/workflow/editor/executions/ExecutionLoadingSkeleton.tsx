import { Skeleton } from "@/components/ui/skeleton";

export function ExecutionLoadingSkeleton() {
    return (
        <div className="h-full flex flex-col space-y-8 p-4 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-8 w-20 rounded-full bg-white/5" />
                    <Skeleton className="h-6 w-24 rounded-full bg-white/5" />
                </div>

                <div className="space-y-3 mb-8">
                    <Skeleton className="h-8 w-64 bg-white/5 rounded-lg" />
                    <Skeleton className="h-3 w-48 bg-white/5 rounded-md" />
                </div>

                {/* Ribbon Stats Skeleton */}
                <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-neutral-950/40 border border-white/5 space-y-3">
                            <Skeleton className="h-2.5 w-16 bg-white/5" />
                            <Skeleton className="h-3 w-24 bg-white/10" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-[1fr,1.3fr] gap-6 items-start">
                {/* Timeline Skeleton */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-white/5" />
                        <Skeleton className="h-3 w-24 bg-white/5" />
                    </div>
                    <div className="space-y-3 bg-neutral-900/20 border border-white/5 p-3 rounded-3xl">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-transparent bg-white/[0.02]">
                                <Skeleton className="h-10 w-10 rounded-lg bg-white/5" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-2 w-12 bg-white/5" />
                                    <Skeleton className="h-3 w-32 bg-white/10" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inspector Skeleton */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Skeleton className="h-3 w-3 rounded-full bg-white/5" />
                        <Skeleton className="h-3 w-24 bg-white/5" />
                    </div>
                    <div className="h-[500px] bg-neutral-900/40 border border-white/5 rounded-3xl p-6 space-y-6">
                        <div className="flex gap-4 border-b border-white/5 pb-4">
                            <Skeleton className="h-4 w-16 bg-white/10 rounded-md" />
                            <Skeleton className="h-4 w-16 bg-white/5 rounded-md" />
                        </div>
                        <Skeleton className="h-full w-full bg-white/[0.02] rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}