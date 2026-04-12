'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PlusIcon, FolderPlusIcon } from 'lucide-react';
import { DialogWrapper } from '@/components/DialogWrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { WorkflowType } from '@neuron/shared';
import { nanoid } from 'nanoid';
import { useWorkflows } from '@/hooks/workflow/useWorkflows';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { WorkflowConfigurationTabs } from '@/components/workflow/WorkflowConfigurationTabs';

export const WorkflowsHeader = () => {
    const { AddNewWorkflow, createWorkflow } = useWorkflows();
    const { createWorkspace } = useWorkspaces();

    // States
    const [workspaceName, setWorkspaceName] = useState('');
    const [newWorkflow, setNewWorkflow] = useState<WorkflowType>({
        id: nanoid(),
        isActive: false,
        name: '',
        description: '',
        status: 'draft',
        runs: 0,
        userId: 'ds',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    // Handlers
    const handleCreateWorkspace = async () => {
        if (!workspaceName.trim()) return;
        await createWorkspace(workspaceName);
        setWorkspaceName('');
    };

    const handleCreateWorkflow = async () => {
        await AddNewWorkflow(newWorkflow);
        await createWorkflow();
    };

    return (
        <div className={cn('between h-fit w-full flex-row gap-2.5 p-2.5')}>
            <div className={cn('container-full center justify-start!')}>
                <h2 className="mb-6 text-sm font-bold tracking-[0.2em] text-neutral-500 uppercase">
                    Workspace
                </h2>
            </div>

            <div className={cn('center gap-2')}>
                {/* --- CREATE WORKSPACE --- */}
                <DialogWrapper
                    triggerButton={
                        <Button
                            className={cn('h-8 gap-1.5 border-white/5 bg-neutral-900/50')}
                            variant={'outline'}
                        >
                            <FolderPlusIcon size={15} />
                            Workspace
                        </Button>
                    }
                    title={'Create New Workspace'}
                    description={'Group your workflows together by project or department.'}
                    actionButton={
                        <Button
                            className={cn('h-7 gap-1.5')}
                            onClick={handleCreateWorkspace}
                            variant={'default'}
                            disabled={!workspaceName.trim()}
                        >
                            <PlusIcon size={15} />
                            Create
                        </Button>
                    }
                >
                    <div className="flex w-full flex-col gap-4 p-4">
                        <div className="space-y-2">
                            <Label htmlFor="ws-name" className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Workspace Name
                            </Label>
                            <Input
                                id="ws-name"
                                placeholder="e.g., Marketing Automations"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="border-white/5 bg-neutral-950"
                            />
                        </div>
                    </div>
                </DialogWrapper>

                {/* --- CREATE WORKFLOW (EXISTING) --- */}
                <DialogWrapper
                    triggerButton={
                        <Button className={cn('h-8 gap-1.5')} variant={'default'}>
                            <PlusIcon size={15} />
                            New
                        </Button>
                    }
                    title={'Create New Workflow'}
                    description={''}
                    actionButton={
                        <Button
                            className={cn('h-7 gap-1.5')}
                            onClick={handleCreateWorkflow}
                            variant={'default'}
                        >
                            <PlusIcon size={15} />
                            Create
                        </Button>
                    }
                >
                    <div className={cn('flex h-100 w-full flex-col items-center justify-start')}>
                        <WorkflowConfigurationTabs />
                    </div>
                </DialogWrapper>
            </div>
        </div>
    );
};