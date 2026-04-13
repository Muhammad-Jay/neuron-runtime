'use client';

import React from 'react';
import { PlusIcon, ZapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/DialogWrapper';
import { useWorkflows } from '@/hooks/workflow/useWorkflows';
import FormField from '@/components/FormField';
import { cn } from '@/lib/utils';

export const CreateWorkflowDialog = () => {
    const { createWorkflow, newWorkflow, setNewWorkflow } = useWorkflows();

    const handleFieldChange = (path: string, value: any) => {
        setNewWorkflow((prev: any) => {
            const keys = path.split('.');
            const updated = { ...prev };
            let current: any = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const isReady = newWorkflow.general?.name?.trim().length > 0;

    return (
        <DialogWrapper
            triggerButton={
                <Button className="h-8 gap-1.5 shadow-lg shadow-blue-500/10" variant="default">
                    <PlusIcon size={14} className="fill-current" />
                    <span className="text-xs font-bold">New Workflow</span>
                </Button>
            }
            title="Create Workflow"
            description="Set the foundation for your new automated process."
            actionButton={
                <Button
                    className="h-8 gap-1.5 px-6"
                    onClick={() => createWorkflow()}
                    disabled={!isReady}
                >
                    <PlusIcon size={14} />
                    Create
                </Button>
            }
        >
            <div className="flex w-full flex-col gap-5 p-6">
                <div className="space-y-4">
                    <FormField
                        label="Workflow Name"
                        type="text"
                        path="general.name"
                        value={newWorkflow.general?.name || ''}
                        onChange={handleFieldChange}
                        placeholder="e.g., Jira to Asana Sync"
                    />

                    <FormField
                        label="Description"
                        type="textArea"
                        path="general.description"
                        value={newWorkflow.general?.description || ''}
                        onChange={handleFieldChange}
                        placeholder="Describe what this workflow automates..."
                    />
                </div>

                {/* Optional Hint */}
                <div className="rounded-lg border border-white/[0.03] bg-neutral-900/30 p-3">
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                        Tip: You can configure advanced execution and runtime settings later inside the workflow editor.
                    </p>
                </div>
            </div>
        </DialogWrapper>
    );
};