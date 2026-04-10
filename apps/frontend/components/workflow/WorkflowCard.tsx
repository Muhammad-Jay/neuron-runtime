'use client';

import React from 'react';
import {
    Calendar,
    ChevronRight,
    Trash2,
    FileText,
    MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkflow } from '@/hooks/workflow/useWorkflow';
import { cn } from '@/lib/utils';
import {WorkflowType} from "@neuron/shared";

export const WorkflowCard = ({
                                 workflow,
                                 clickAction,
                                 deleteAction,
                             }: {
    workflow: WorkflowType;
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
                'hover:bg-neutral-900/70' // Subtle Notion-style hover background
            )}
        >
            {/* 1. TOP: Actions (Hidden until hover) */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 transition-opacity duration-200 rounded-md group-hover:bg-neutral-800/60! group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                    }}
                    disabled={isDeleting}
                    className="h-7 w-7 rounded-md text-neutral-500 hover:bg-neutral-800 hover:text-red-400"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <div className="h-7 w-7 flex items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-800">
                    <MoreVertical className="h-3.5 w-3.5" />
                </div>
            </div>

            {/* 2. ICON & TITLE */}
            <div onClick={handleClick} className="flex items-start cursor-pointer rounded-md group-hover:bg-neutral-800/60! p-1 gap-3">
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

            {/* 3. METRICS / TAGS (Middle Section) */}
            <div onClick={handleClick} className="flex flex-wrap cursor-pointer items-center  rounded-md p-2 py-3! group-hover:bg-neutral-800/60! gap-4 pt-1">
                <div className="flex items-center gap-1.5 text-neutral-500">
                    <Calendar className="h-3 w-3" />
                    <span className="text-[11px]">
            {new Date(workflow.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
            })}
          </span>
                </div>

                {/* Subtle Status Indicator */}
                <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-neutral-700" />
                    <span className="text-[11px] text-neutral-500">Draft</span>
                </div>
            </div>

            {/* 4. FOOTER: Open Button (Subtle & Modern) */}
            <div className="mt-1 flex items-center justify-start">
                <div  onClick={handleClick} className="flex cursor-pointer items-center gap-1 text-[11px] font-medium text-neutral-500 transition-colors group-hover:text-neutral-300">
                    Open Project
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </div>
    );
};