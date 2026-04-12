'use server';

import {authorizedFetch} from "@/lib/api-client/authorizeFetch";

const URL = process.env.NEXT_PUBLIC_API_ENDPOINT! as string;

export async function getWorkspacesRequest(token: string) {
    const url = `${URL}/workspaces`;
    const options = {
        method: 'GET',
    };

    return await authorizedFetch(url, options, token);
}

export async function createWorkspaceRequest(
    data: { name: string; description?: string },
    token: string
) {
    const url = `${URL}/workspaces`;
    const options = {
        method: 'POST',
        body: JSON.stringify(data),
    };

    return await authorizedFetch(url, options, token);
}

export async function updateWorkspaceRequest(
    id: string,
    data: { name?: string; description?: string },
    token: string
) {
    const url = `${URL}/workspaces/${id}`;
    const options = {
        method: 'PATCH',
        body: JSON.stringify(data),
    };

    return await authorizedFetch(url, options, token);
}

export async function deleteWorkspaceRequest(id: string, token: string) {
    const url = `${URL}/workspaces/${id}`;
    const options = {
        method: 'DELETE',
    };

    return await authorizedFetch(url, options, token);
}

/**
 * Reassigns a workflow to a specific workspace (or null to unassign)
 * Used primarily for the Drag & Drop grouping logic.
 */
export async function assignWorkflowToWorkspaceRequest(
    payload: { workflowId: string; workspaceId: string | null },
    token: string
) {
    const url = `${URL}/workspaces/assign-workflow`;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
    };

    return await authorizedFetch(url, options, token);
}