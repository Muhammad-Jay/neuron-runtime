'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { WorkspaceGroup } from './WorkspaceGroup';
import { WorkflowActionsDropdown } from "@/components/workflow/WorkflowActionsDropdown";
import { DraggableWorkflowWrapper } from '../DraggableWorkflowWrapper';
import { cn } from '@/lib/utils';

interface WorkspaceCardProps {
    workspace: {
        id: string;
        name: string;
        workflows: Record<string, any>;
    };
    onWorkflowClick: (id: string) => void;
    onDeleteWorkflow: (id: string) => Promise<void>;
}

export const WorkspaceCard = ({
                                  workspace,
                                  onWorkflowClick,
                                  onDeleteWorkflow
                              }: WorkspaceCardProps) => {
    const router = useRouter();
    const workflowList = Object.values(workspace.workflows);
    const workflowCount = workflowList.length;

    // 1. Setup Droppable logic for this workspace
    const { setNodeRef } = useDroppable({
        id: workspace.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative rounded-xl transition-all duration-300"
            )}
        >
            <WorkspaceGroup
                id={workspace.id}
                title={workspace.name}
                count={workflowCount}
            >
                <div className="flex flex-col h-full">
                    {/* 2. The 2x2 Mini Preview Grid */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 p-3 flex-grow">
                        {workflowList.slice(0, 4).map((wf) => (
                            <DraggableWorkflowWrapper
                                key={wf.id}
                                id={wf.id}
                                workflow={wf}
                            >
                                <div
                                    className={cn(
                                        "group/wf relative flex flex-col justify-between overflow-hidden rounded-xl p-3 transition-all duration-300 cursor-pointer h-full w-full",
                                        "bg-muted/65 border border-white/[0.05] hover:bg-neutral-800/60 hover:border-white/15 hover:shadow-lg"
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onWorkflowClick(wf.id);
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="truncate text-[13px] font-semibold text-neutral-300 group-hover/wf:text-white">
                                            {wf.name || 'Untitled'}
                                        </span>
                                        <div className={cn(
                                            "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                                            wf.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-neutral-600"
                                        )} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-medium text-neutral-500 uppercase">
                                            {new Date(wf.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Inner Actions */}
                                    <div
                                        className="absolute bottom-2 right-1 opacity-0 group-hover/wf:opacity-100 transition-opacity z-20"
                                        onClick={(e) => e.stopPropagation()} // Prevent card click
                                    >
                                        <WorkflowActionsDropdown
                                            workflow={wf}
                                            onDelete={() => onDeleteWorkflow(wf.id)}
                                            triggerClassName="h-6 w-6 text-neutral-500 hover:text-white"
                                        />
                                    </div>
                                </div>
                            </DraggableWorkflowWrapper>
                        ))}

                        {/* Fillers for empty slots */}
                        {Array.from({ length: Math.max(0, 4 - workflowCount) }).map((_, i) => (
                            <div key={`empty-${i}`} className="rounded-xl border border-dashed border-white/[0.03] opacity-40 min-h-[80px]" />
                        ))}
                    </div>

                    {/* 3. Workspace Navigation Footer */}
                    <div
                        onClick={() => router.push(`/dashboard/workflows/${workspace.id}`)}
                        className={cn(
                            "group/nav flex items-center justify-between mx-3 mb-3 p-2.5 rounded-lg cursor-pointer transition-all",
                            "bg-neutral-900/50 hover:bg-neutral-800 border border-white/[0.02] hover:border-white/5"
                        )}
                    >
                        <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 group-hover/nav:text-neutral-200">
                            Open Workspace
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-neutral-600 group-hover/nav:text-white transition-transform group-hover/nav:translate-x-0.5" />
                    </div>
                </div>
            </WorkspaceGroup>
        </div>
    );
};