import { Skeleton } from "@/components/ui/skeleton"

export const WorkflowLoadingSkeleton = () => {
    return (
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-xl">
                    <Skeleton className="h-full w-full rounded-xl" />
                </div>
            ))}
        </div>
    )
}