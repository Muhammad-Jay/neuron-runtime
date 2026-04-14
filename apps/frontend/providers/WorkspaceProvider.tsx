'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
    getWorkspacesRequest,
    createWorkspaceRequest,
    deleteWorkspaceRequest,
    assignWorkflowToWorkspaceRequest
} from '@/lib/api-client/workspace.client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import {useWorkflows} from "@/hooks/workflow/useWorkflows";
import {getWorkflowsRequest} from "@/lib/api-client/client";
import {WorkflowActionType} from "@/constants";
import {WorkflowType} from "@neuron/shared";

interface Workspace {
    id: string;
    name: string;
    description?: string;
    workflows: Record<string, WorkflowType>;
    createdAt: Date;
}

type WorkspaceRecord = Record<string, Workspace>;

interface WorkspaceContextType {
    workspaces: WorkspaceRecord; // Single source of truth
    isLoading: boolean;
    refreshWorkspaces: () => Promise<void>;
    createWorkspace: (name: string, description?: string) => Promise<void>;
    deleteWorkspace: (id: string) => Promise<void>;
    assignWorkflow: (workflowId: string, workspaceId: string | null, workflow: WorkflowType) => Promise<void>;
    setWorkflowInWorkspace: (workflowId: string, workspaceId: string | null, workflow: WorkflowType) => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
    const [workspaces, setWorkspaces] = useState<WorkspaceRecord>({});
    const { workflowsDispatcher } = useWorkflows();
    const [isLoading, setIsLoading] = useState(false);
    const { user, session } = useAuth();

    const token = session?.access_token;

    const loadWorkspaces = useCallback(async () => {
        if (!token) return;

        try {
            setIsLoading(true);

            // 1. Fetch both in parallel for speed
            const [wsResponse, wfResponse] = await Promise.all([
                getWorkspacesRequest(token),
                getWorkflowsRequest(token)
            ]);

            // 2. Process Workflows (Global List)
            if (wfResponse?.success) {
                workflowsDispatcher({
                    type: WorkflowActionType.SET_WORKFLOWS,
                    payload: wfResponse.data,
                });
            }

            // 3. Process Workspaces (Nested Record)
            if (wsResponse?.data) {
                const record = wsResponse.data.reduce((acc: WorkspaceRecord, ws: any) => {
                    const workflowRecord = (ws.workflows || []).reduce((wAcc: Record<string, any>, wf: any) => {
                        wAcc[wf.id] = wf;
                        return wAcc;
                    }, {});

                    acc[ws.id] = { ...ws, workflows: workflowRecord };
                    return acc;
                }, {});

                setWorkspaces(record);
            }
        } catch (error) {
            toast.error('Failed to synchronize data');
        } finally {
            setIsLoading(false);
        }
    }, [token, workflowsDispatcher]);

    const createWorkspace = useCallback(async (name: string, description?: string) => {
        if (!token) return;

        const nameExists = Object.values(workspaces).some(
            ws => ws.name.toLowerCase() === name.toLowerCase()
        );

        if (nameExists) {
            toast.error(`Workspace "${name}" already exists`);
            return;
        }

        const response = await createWorkspaceRequest({ name, description }, token);
        if (response) {
            toast.success('Workspace created');
            setWorkspaces(prev => ({
                ...prev,
                [response.id]: { ...response, workflows: {} }
            }));
        }
    }, [token, workspaces]);

    const removeWorkspace = useCallback(async (id: string) => {
        if (!token) return;
        const response = await deleteWorkspaceRequest(id, token);

        if (response) {
            toast.success(response?.message ?? 'Workspace removed');
            setWorkspaces(prev => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    }, [token]);

    const setWorkflowInWorkspace = useCallback((
        workflowId: string,
        workspaceId: string | null,
        workflow: WorkflowType
    ) => {
        setWorkspaces(prev => {
            const next = { ...prev };
            let targetWorkflow = workflow;

            // Step A: Remove from any existing workspace and capture the object if not provided
            Object.keys(next).forEach(id => {
                if (next[id].workflows[workflowId]) {
                    if (!targetWorkflow) targetWorkflow = next[id].workflows[workflowId];

                    const newWorkflows = { ...next[id].workflows };
                    delete newWorkflows[workflowId];
                    next[id] = { ...next[id], workflows: newWorkflows };
                }
            });

            // Step B: Add to the new workspace (if target is a workspace and we have the workflow data)
            if (workspaceId && next[workspaceId] && targetWorkflow) {
                next[workspaceId] = {
                    ...next[workspaceId],
                    workflows: {
                        [workflowId]: targetWorkflow,
                        ...next[workspaceId].workflows
                    }
                };
            }

            return next;
        });
    }, []);

    const assignWorkflow = useCallback(async (
        workflowId: string,
        workspaceId: string | null,
        workflow: WorkflowType
    ) => {
        if (!token) return;

        const previousState = { ...workspaces };

        // 1. Optimistic Update using our extracted logic
        setWorkflowInWorkspace(workflowId, workspaceId, workflow);

        try {
            const response = await assignWorkflowToWorkspaceRequest({ workflowId, workspaceId }, token);
            if (!response) {

            }
        } catch (error) {
            setWorkspaces(previousState);
            toast.error('Failed to reassign workflow');
        }
    }, [token, workspaces, setWorkflowInWorkspace]);


    useEffect(() => {
        if (user && token) loadWorkspaces();
    }, [token, user]);

    const value = useMemo(() => ({
        workspaces,
        isLoading,
        refreshWorkspaces: loadWorkspaces,
        createWorkspace,
        deleteWorkspace: removeWorkspace,
        assignWorkflow,
        setWorkflowInWorkspace,
    }), [
        workspaces,
        isLoading,
        loadWorkspaces,
        createWorkspace,
        removeWorkspace,
        assignWorkflow,
        setWorkflowInWorkspace]);

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
        </WorkspaceContext.Provider>
    );
};