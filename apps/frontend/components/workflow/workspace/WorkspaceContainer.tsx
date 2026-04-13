'use client';

import React, { useMemo } from 'react';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { DraggableWorkflowWrapper } from '../DraggableWorkflowWrapper';
import { WorkspaceGroup } from './WorkspaceGroup';
import { WorkflowCard } from '../WorkflowCard';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import {WorkspaceCard} from "@/components/workflow/workspace/WorkspaceCard";
import {WorkflowType} from "@neuron/shared";

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
    const { workspaces, assignWorkflow, setWorkflowInWorkspace } = useWorkspaces();
    const { open } = useSidebar();

    /**
     * Identify assigned IDs by looking through our WorkspaceRecord
     */
    const assignedWorkflowIds = useMemo(() => {
        const ids = new Set<string>();
        Object.values(workspaces).forEach(ws => {
            Object.keys(ws.workflows).forEach(wfId => ids.add(wfId));
        });
        return ids;
    }, [workspaces]);

    /**
     * Workflows not present in any workspace Record
     */
    const unassignedWorkflows = useMemo(() => {
        return workflows.filter(wf => !assignedWorkflowIds.has(wf.id) || wf.workspaceId === null);
    }, [workflows, assignedWorkflowIds]);


    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        const workflowId = active.id as string;
        const destinationId = over.id as string;
        const workflowData = active.data.current?.workflow;

        // Optimistically update the record-based state
        setWorkflowInWorkspace(workflowId, destinationId === 'general' ? null : destinationId, workflowData);

        // Trigger backend sync
        const workspaceId = destinationId === 'general' ? null : destinationId;
        await assignWorkflow(workflowId, workspaceId, workflowData);
    }


    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-12 py-4">
                {/* --- Workspace Grid: Using Object.values for Records --- */}
                <div className={cn(
                    "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all duration-500",
                    open && "lg:grid-cols-2 xl:grid-cols-3"
                )}>
                    {Object.values(workspaces).map((workspace) => (
                        <WorkspaceCard
                            key={workspace.id}
                            workspace={workspace}
                            onWorkflowClick={onCardClick}
                            onDeleteWorkflow={deleteWorkflow}
                        />
                    ))}
                </div>

                {/* --- Unassigned Section --- */}
                <div className="mt-8">
                    <h2 className="mb-6 text-sm font-bold tracking-[0.2em] text-neutral-500 uppercase">
                        Workflows
                    </h2>
                    {/* The unassigned area also acts as a "general" drop target */}
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