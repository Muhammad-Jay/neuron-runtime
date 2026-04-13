'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CreateWorkspaceDialog } from './workspace/CreateWorkspaceDialog';
import { CreateWorkflowDialog } from './CreateWorkflowDialog';

export const WorkflowsHeader = () => {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-white/[0.02] bg-neutral-950/50 px-6 backdrop-blur-md">
            {/* Left Side: Branding/Context */}
            <div className="flex items-center gap-4">
                <h2 className="text-xs font-bold tracking-[0.3em] text-neutral-500 uppercase">
                     <span className="text-neutral-200">Workspaces</span>
                </h2>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-2.5">
                <CreateWorkspaceDialog />
                <div className="h-4 w-[1px] bg-white/5 mx-1" />
                <CreateWorkflowDialog />
            </div>
        </header>
    );
};