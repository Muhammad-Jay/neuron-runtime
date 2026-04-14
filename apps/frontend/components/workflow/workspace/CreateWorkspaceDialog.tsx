'use client';

import React, { useState } from 'react';
import { FolderPlusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogWrapper } from '@/components/DialogWrapper';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { cn } from '@/lib/utils';

export const CreateWorkspaceDialog = () => {
    const [name, setName] = useState('');
    const { createWorkspace } = useWorkspaces();

    const handleCreate = async () => {
        if (!name.trim()) return;
        await createWorkspace(name);
        setName('');
    };

    return (
        <DialogWrapper
            className={"h-fit! md:w-3/6!"}
            contentClassName={"h-fit! py-5!"}
            triggerButton={
                <Button
                    className="h-8 gap-1.5 border-white/5 bg-neutral-900/50 hover:bg-neutral-800"
                    variant="outline"
                >
                    <FolderPlusIcon size={14} className="text-neutral-400" />
                    <span className="text-xs font-medium">Workspace</span>
                </Button>
            }
            title="Create New Workspace"
            description="Organize your workflows into specific project groups or departments."
            actionButton={
                <Button
                    className="h-8 gap-1.5 px-4"
                    onClick={handleCreate}
                    disabled={!name.trim()}
                >
                    <PlusIcon size={14} />
                    Create
                </Button>
            }
        >
            <div className="space-y-4 p-4">
                <div className="space-y-2">
                    <Label htmlFor="ws-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                        Workspace Name
                    </Label>
                    <Input
                        id="ws-name"
                        placeholder="e.g., Production Pipelines"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-white/5 bg-neutral-950 focus-visible:ring-neutral-800"
                    />
                </div>
            </div>
        </DialogWrapper>
    );
};