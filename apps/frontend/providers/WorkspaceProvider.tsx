'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
    getWorkspacesRequest,
    createWorkspaceRequest,
    deleteWorkspaceRequest,
    assignWorkflowToWorkspaceRequest
} from '@/lib/api-client/workspace.client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Workspace {
    id: string;
    name: string;
    description?: string;
    workflows: any[];
}

interface WorkspaceContextType {
    workspaces: Workspace[];
    isLoading: boolean;
    refreshWorkspaces: () => Promise<void>;
    createWorkspace: (name: string, description?: string) => Promise<void>;
    deleteWorkspace: (id: string) => Promise<void>;
    assignWorkflow: (workflowId: string, workspaceId: string | null, workflow: any) => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, session } = useAuth();

    const token = session?.access_token;

    const loadWorkspaces = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        try {
            const response = await getWorkspacesRequest(token);
            if (response) {
                console.log(response);
                setWorkspaces(response.data);
            } else {
                toast.error('Failed to load workspaces');
            }
        } catch (error) {
            console.error('Error fetching workspaces:', error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    // Handle creating a new workspace group
    const createWorkspace = async (name: string, description?: string) => {
        if (!token) return;

        const existingName = workspaces.find(ws => ws.name === name);

        if (existingName){
            toast.error(`name ${name} already exist`,{
                description: "multiple workspaces cannot have the same name.",
            });
            return;
        }

        const response = await createWorkspaceRequest({ name, description }, token);

        if (response) {
            toast.success('Workspace created');
            setWorkspaces(prev => ([response, ...prev]));
        } else {
            toast.error('Could not create workspace');
        }
    };

    // Handle workspace deletion
    const removeWorkspace = async (id: string) => {
        if (!token) return;
        const response = await deleteWorkspaceRequest(id, token);

        if (response) {
            toast.success('Workspace removed');
            setWorkspaces(prev => prev.filter(ws => ws.id !== id));
        } else {
            toast.error('Failed to delete workspace');
        }
    };

    // The Drag & Drop Logic (Optimistic UI)
    const assignWorkflow = async (workflowId: string, workspaceId: string | null, workflow: any) => {
        if (!token) return;

        // Optimistic Update: Move the workflow locally first
        const previousState = [...workspaces];

        if (workflow) {
            setWorkspaces(prev => prev.map(ws => ws.id === workspaceId
                ? ({
                    ...ws,
                    workflows: [workflow, ...ws.workflows]
                })
                : ws));
        }

        const response = await assignWorkflowToWorkspaceRequest(
            { workflowId, workspaceId },
            token
        );

        if (response) {

        } else {
            setWorkspaces(previousState); // Rollback on error
            toast.error('Failed to reassign workflow');
        }
    };

    useEffect(() => {
        if (user && token) {
            loadWorkspaces();
        }
    }, [loadWorkspaces]);

    return (
        <WorkspaceContext.Provider value={{
            workspaces,
            isLoading,
            refreshWorkspaces: loadWorkspaces,
            createWorkspace,
            deleteWorkspace: removeWorkspace,
            assignWorkflow
        }}>
            {children}
        </WorkspaceContext.Provider>
    );
};