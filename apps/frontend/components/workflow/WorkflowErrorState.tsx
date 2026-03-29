"use client";

import { Button } from "@/components/ui/button"

export const WorkflowErrorState = ({ message }: { message: string }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <p className="text-destructive font-medium">
                Failed to load workflows
            </p>
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button onClick={() => window.location.reload()}>
                Retry
            </Button>
        </div>
    )
}