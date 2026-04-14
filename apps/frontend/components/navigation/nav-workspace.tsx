'use client';

import React from 'react';
import { Folder, MoreHorizontal, Layers } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useWorkspaces } from '@/hooks/workspace/useWorkspace';
import { WorkspaceActionsDropdown } from '../workflow/workspace/WorkspaceActionDropdown';
import { Skeleton } from '@/components/ui/skeleton';

export function NavWorkspaces() {
    const { workspaces, isLoading } = useWorkspaces();

    // Convert Record to Array and take the last 5
    const workspaceList = React.useMemo(() => {
        return Object.values(workspaces)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [workspaces]);

    if (isLoading) {
        return (
            <SidebarGroup>
                <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
                <SidebarMenu>
                    {[...Array(3)].map((_, i) => (
                        <SidebarMenuItem key={i} className="px-2 py-1">
                            <Skeleton className="h-8 w-full bg-white/5 rounded-md" />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        );
    }

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="text-neutral-500 font-bold tracking-widest uppercase text-[10px]">
                Recent Workspaces
            </SidebarGroupLabel>
            <SidebarMenu>
                {workspaceList.map((workspace) => (
                    <SidebarMenuItem key={workspace.id} className="group/item">
                        <SidebarMenuButton asChild>
                            <a href={`/dashboard/workflows/${workspace.id}`} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-neutral-400 group-hover/item:text-white transition-colors" />
                                    <span className="truncate font-medium text-neutral-300 group-hover/item:text-white">
                    {workspace.name}
                  </span>
                                </div>
                                {/* Counter for workflows */}
                                <span className="mr-6 text-[10px] font-bold text-neutral-600 group-hover/item:text-neutral-400 transition-colors">
                  {Object.keys(workspace.workflows || {}).length}
                </span>
                            </a>
                        </SidebarMenuButton>

                        {/* Custom Workspace Actions */}
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <WorkspaceActionsDropdown
                                workspaceId={workspace.id}
                                workspaceName={workspace.name}
                            />
                        </div>
                    </SidebarMenuItem>
                ))}

                {workspaceList.length === 0 && (
                    <div className="px-4 py-2 text-[12px] text-neutral-600 italic">
                        No active workspaces
                    </div>
                )}

                <SidebarMenuItem>
                    <SidebarMenuButton className="text-neutral-500 hover:text-white transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="text-[12px]">View all workspaces</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}