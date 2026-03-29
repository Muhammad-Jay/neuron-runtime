"use client"

import { WorkflowCard } from "@/components/workflow/WorkflowCard"
import { WorkflowLoadingSkeleton } from "@/components/workflow/WorkflowLoadingSkeleton"
import { WorkflowErrorState } from "@/components/workflow/WorkflowErrorState"
import { Button } from "@/components/ui/button"
import {useWorkflows} from "@/hooks/workflow/useWorkflows";
import {WorkflowsHeader} from "@/components/workflow/WorkflowsHeader";
import {useRouter} from "next/navigation";
import {useSidebar} from "@/components/ui/sidebar";
import {cn} from "@/lib/utils";

export default function Workflow() {
    const router = useRouter();
    const {open} = useSidebar();
    const {
        workflows,
        isWorkflowLoading,
        workflowErrors,
        createWorkflow,
        deleteWorkflow,
    } = useWorkflows()

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-5 pt-0">
            <WorkflowsHeader/>

            {isWorkflowLoading ? (
                <WorkflowLoadingSkeleton />
            ) : workflowErrors ? (
                <WorkflowErrorState message={workflowErrors} />
            ) : (
                <div className={cn("grid auto-rows-min gap-4 space-y-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
                    open && 'md:grid-cols-3'
                )}>
                    {workflows.map((workflow) => (
                        <WorkflowCard
                            key={workflow.id}
                            workflow={workflow}
                            deleteAction={deleteWorkflow}
                            clickAction={async (id) => {
                                router.push(`/editor/${id}`)
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}