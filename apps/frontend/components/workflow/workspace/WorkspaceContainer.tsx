'use client';

import React, { useMemo } from 'react';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { DraggableWorkflowWrapper } from '../DraggableWorkflowWrapper';
import { WorkflowType } from '@neuron/shared';
import { WorkspaceGroup } from './WorkspaceGroup';
import { WorkflowCard } from '../WorkflowCard';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { DndContext, DragEndEvent } from '@dnd-kit/core';

interface WorkspaceContainerProps {
    workflows: WorkflowType[];
    deleteWorkflow: (id: string) => Promise<void>;
    onCardClick: (id: string) => void;
}

export const WorkspaceContainer = ({
                                       workflows,
                                       deleteWorkflow,
                                       onCardClick,
                                   }: WorkspaceContainerProps) => {
    const { workspaces, assignWorkflow } = useWorkspaces();
    const { open } = useSidebar();

    const assignedWorkflowIds = useMemo(() => {
        const ids = new Set<string>();
        workspaces.forEach(ws => {
            ws.workflows?.forEach(wf => ids.add(wf.id));
        });
        return ids;
    }, [workspaces]);

    const unassignedWorkflows = useMemo(() => {
        return workflows.filter(wf => !assignedWorkflowIds.has(wf.id));
    }, [workflows, assignedWorkflowIds]);


    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const workflowId = active.id as string;
        const destinationId = over.id as string;

        // If destination is 'general', we send null to unassign it
        const workspaceId = destinationId === 'general' ? null : destinationId;

        // This triggers the backend request and UI refresh we built earlier
        assignWorkflow(workflowId, workspaceId, active.data.workflow);
    }


    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-12 py-4">
                {/* --- Workspace Grid: 3 Columns on LG --- */}
                <div className={cn(
                    "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500",
                    open && "lg:grid-cols-2 xl:grid-cols-3"
                )}>
                    {workspaces.map((workspace) => (
                        <WorkspaceGroup
                            id={workspace.id}
                            key={workspace.id}
                            title={workspace.name}
                            count={workspace.workflows?.length || 0}
                        >
                            {/* Inner Workflow Grid: Col-2 / Row-2 style */}
                            <div className="grid grid-cols-2 grid-rows-2 container-full! gap-2 p-3">
                                {workspace.workflows?.slice(0, 4).map((wf) => (
                                    <div
                                        key={wf.id}
                                        className="aspect-video rounded-lg container-full! h-full! bg-muted/65 border border-white/5 flex items-center justify-center p-2 group/wf"
                                        onClick={() => onCardClick(wf.id)}
                                    >
                                        <div className="w-full truncate text-sm text-neutral-500 group-hover/wf:text-white transition-colors">
                                            {wf.name}
                                        </div>
                                    </div>
                                ))}
                                {/* Fill empty slots to maintain 2x2 feel */}
                                {Array.from({ length: Math.max(0, 4 - (workspace.workflows?.length || 0)) }).map((_, i) => (
                                    <div key={i} className="aspect-video rounded-lg container-full! h-full! bg-muted/65 border border-dashed border-white/5" />
                                ))}
                            </div>
                        </WorkspaceGroup>
                    ))}
                </div>

                {/* --- Unassigned Section (Kept as flat grid for visibility) --- */}
                <div className="mt-8">
                    <h2 className="mb-6 text-sm font-bold tracking-[0.2em] text-neutral-500 uppercase">
                        Workflows
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {unassignedWorkflows.map((wf) => (
                            <DraggableWorkflowWrapper key={wf.id} id={wf.id} workflow={wf}>
                                <WorkflowCard
                                    workflow={wf}
                                    deleteAction={deleteWorkflow}
                                    clickAction={async (id) => onCardClick(id)}
                                />
                            </DraggableWorkflowWrapper>
                        ))}
                    </div>
                </div>
            </div>
        </DndContext>
    );
};