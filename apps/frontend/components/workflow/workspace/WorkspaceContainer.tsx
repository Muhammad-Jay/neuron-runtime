'use client';

import React, { useMemo } from 'react';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { DraggableWorkflowWrapper } from '../DraggableWorkflowWrapper';
import { WorkflowCard } from '../WorkflowCard';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable // Added for the unassigned area
} from '@dnd-kit/core';
import { WorkspaceCard } from "@/components/workflow/workspace/WorkspaceCard";
import { WorkflowType } from "@neuron/shared";

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

    /** * 1. SENSOR CONFIGURATION
     * This is the fix for the click issue. We require 8px of movement
     * before the drag starts, allowing regular clicks to pass through.
     */
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const assignedWorkflowIds = useMemo(() => {
        const ids = new Set<string>();
        Object.values(workspaces).forEach(ws => {
            Object.keys(ws.workflows).forEach(wfId => ids.add(wfId));
        });
        return ids;
    }, [workspaces]);

    const unassignedWorkflows = useMemo(() => {
        return workflows.filter(wf => !assignedWorkflowIds.has(wf.id) || wf.workspaceId === null);
    }, [workflows, assignedWorkflowIds]);

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        // If dropped nowhere, do nothing
        if (!over) return;

        const workflowId = active.id as string;
        const destinationId = over.id as string; // Workspace ID or 'general'
        const workflowData = active.data.current?.workflow;

        // Determine target workspace (null means unassigned/general)
        const targetWorkspaceId = destinationId === 'general' ? null : destinationId;


        setWorkflowInWorkspace(workflowId, targetWorkspaceId, workflowData);

        // Sync with Backend
        try {
            await assignWorkflow(workflowId, targetWorkspaceId, workflowData);
        } catch (error) {
            // WorkspaceContext should handle the rollback if this fails
            console.error("Failed to move workflow:", error);
        }
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex flex-col gap-12 py-4">
                {/* --- Workspace Grid --- */}
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
                <UnassignedDropZone
                    workflows={unassignedWorkflows}
                    onCardClick={onCardClick}
                    deleteWorkflow={deleteWorkflow}
                />
            </div>
        </DndContext>
    );
};

/**
 * Internal helper to make the Unassigned area a valid drop target
 */
const UnassignedDropZone = ({ workflows, onCardClick, deleteWorkflow }: any) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'general',
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "mt-8 rounded-2xl p-4 transition-colors duration-300",
                isOver ? "bg-blue-500/5 ring-1 ring-primary/20" : "bg-transparent"
            )}
        >

            <h2 className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
                <span className="text-neutral-200">Workflows</span>
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {workflows.map((wf: any) => (
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
    );
};