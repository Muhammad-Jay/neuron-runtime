'use client';

import React from 'react';
import { Calendar, ChevronRight, FileText } from 'lucide-react';
import { useWorkflow } from '@/hooks/workflow/useWorkflow';
import { cn } from '@/lib/utils';
import { WorkflowActionsDropdown } from './WorkflowActionsDropdown';

export const WorkflowCard = ({
                                 workflow,
                                 clickAction,
                                 deleteAction,
                             }: {
    workflow: any;
    clickAction: (id: string) => Promise<void>;
    deleteAction: (id: string) => Promise<void>;
}) => {
    const { handleClick, handleDelete, isDeleting } = useWorkflow({
        workflow,
        clickAction,
        deleteAction,
    });

    return (
        <div
            className={cn(
                'group relative flex w-full cursor-pointer flex-col gap-3 overflow-hidden',
                'rounded-xl bg-muted/55 p-3 transition-all duration-200',
                'hover:bg-neutral-900/70'
            )}
        >
            {/* 1. TOP: Actions (Using the reusable component) */}
            <div
                onClick={(e) => e.stopPropagation()}
                className="absolute z-10 bottom-3 right-3 flex items-center gap-1 opacity-0 transition-opacity duration-200 rounded-md group-hover:opacity-100">
                <WorkflowActionsDropdown
                    workflow={workflow}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                    triggerClassName="h-7 w-7 rounded-md text-neutral-500 hover:bg-neutral-800 hover:text-white focus-visible:ring-0"
                />
            </div>

            {/* 2. ICON & TITLE */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                className="flex items-start cursor-pointer rounded-md p-1 gap-3 group-hover:bg-neutral-800/40 transition-colors"
            >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-800/50">
                    <FileText className="h-4 w-4 text-neutral-400" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <h3 className="truncate text-[14px] font-medium text-neutral-200 transition-colors group-hover:text-white">
                        {workflow.name || 'Untitled Project'}
                    </h3>
                    <p className="mt-0.5 truncate text-[12px] text-neutral-500">
                        {workflow.description || 'No description provided'}
                    </p>
                </div>
            </div>

            {/* 3. METRICS / TAGS */}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                }}
                className="flex flex-wrap cursor-pointer items-center rounded-md p-2 gap-4 pt-1 group-hover:bg-neutral-800/40 transition-colors"
            >
                <div className="flex items-center gap-1.5 text-neutral-500">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[11px]">
                        {new Date(workflow.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                        })}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        workflow.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-neutral-700"
                    )} />
                    <span className="text-[11px] text-neutral-500 capitalize">
                        {workflow.status || 'Draft'}
                    </span>
                </div>
            </div>

            {/* 4. FOOTER */}
            <div className="mt-1 flex items-center justify-start">
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                    className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors group-hover:text-neutral-300"
                >
                    Open Project
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </div>
    );
};