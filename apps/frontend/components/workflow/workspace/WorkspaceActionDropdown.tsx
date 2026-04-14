'use client';

import React from 'react';
import { MoreVertical, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface WorkspaceActionsDropdownProps {
    workspaceId: string;
    workspaceName: string;
    onEdit?: () => void; // Trigger a modal or inline edit
}

export const WorkspaceActionsDropdown = ({
                                             workspaceId,
                                             workspaceName,
                                             onEdit
                                         }: WorkspaceActionsDropdownProps) => {
    const { deleteWorkspace } = useWorkspaces();
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();

        await deleteWorkspace(workspaceId);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-md text-neutral-500 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVertical className="h-3.5 w-3.5 text-neutral-500 hover:text-white" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-white/5 bg-neutral-900 text-neutral-200">
                <DropdownMenuItem
                    className="flex gap-2 text-[12px] focus:bg-neutral-800 focus:text-white"
                    onClick={() => router.push(`/dashboard/workflows/${workspaceId}`)}
                >
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Open Workspace</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    className="flex gap-2 text-[12px] focus:bg-neutral-800 focus:text-white"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.();
                    }}
                >
                    <Edit3 className="h-3.5 w-3.5 text-neutral-400" />
                    <span>Edit Details</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-white/5" />

                <DropdownMenuItem
                    className="flex gap-2 text-[12px] text-red-400 focus:bg-red-400/10 focus:text-red-400"
                    onClick={handleDelete}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};