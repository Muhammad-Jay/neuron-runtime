"use server";

import {authorizedFetch} from "@/lib/api-client/authorizeFetch";
import type {WorkflowDefinition, GlobalVariable, WorkflowNode, WorkflowEdge} from "@neuron/shared";

const URL = process.env.NEXT_PUBLIC_API_ENDPOINT! as string;

export async function createWorkflowRequest(data: any, accessToken: any){
    const ENDPOINT = `${URL}/workflows`;
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
        }
        const response = await fetch(ENDPOINT, options);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const json = await response.json();
        return ({ success: true, data: json.data });

    }catch (e) {

        return ({ success: false, error: e.message });
    }
}

export async function getWorkflowsRequest(token: string) {
    const ENDPOINT = `${URL}/workflows`;

    try {
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        };

        const response = await fetch(ENDPOINT, options);

        if (!response.ok) {
            // Provide more context on failure
            const errorBody = await response.text();
            throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorBody}`);
        }

        const json = await response.json();
        return { success: true, data: json.data };

    } catch (e) {
        console.error("Workflow Request Error:", e.message);
        return { success: false, error: e.message };
    }
}

export async function getWorkflowGraphRequest(workflowId: string, token: any) {

    const url = `${URL}/workflows/${workflowId}/graph`;
    const options = {
        method: "GET",
    };

    return await authorizedFetch(url, options, token);
}

export async function saveWorkflowGraphRequest(workflowId: string, token: any, payload: { graph: { nodes: WorkflowNode[], edges: WorkflowEdge[]}, globalVariables: GlobalVariable[]}) {

    const url = `${URL}/workflows/${workflowId}/graph`;
    const options = {
        method: "POST",
        body: JSON.stringify({ graph: payload.graph, globalVariables: payload.globalVariables }),
    };

    return await authorizedFetch(url, options, token);
}

export async function getSecretRequest(token = null as any){

    const url = `${URL}/secrets`;
    const options = {
        method: "GET",
    };

    return await authorizedFetch(url, options, token);
}

export async function createSecretRequest(name: string, value: string, token: any, ){

    const url = `${URL}/secrets`;
    const options = {
        method: "POST",
        body: JSON.stringify({ name, value }),
    };

    return await authorizedFetch(url, options, token);
}

export async function deleteSecretRequest(id: string, token: any){

    const url = `${URL}/secrets/delete/${id}`;
    const options = {
        method: "DELETE"
    }
    return await authorizedFetch(url, options, token);
}

// Run workflow
export async function runWorkflowRequest(runId: string, token: any){
    const url = `${URL}/workflows/execute/${runId}`;

    const options = {
        method: "GET",
    }

    return await authorizedFetch(url, options, token);
}

export async function deployWorkflowRequest(workflowId: string, data, token: any){
    const url = `${URL}/workflows/deploy/${workflowId}`;
    const options = {
        method: "POST",
        body: JSON.stringify({ ...data }),
    };

    return await authorizedFetch(url, options, token);
}

export async function getDeployWorkflowRequest(workflowId: string, token: any){
    const url = `${URL}/workflows/deploy/${workflowId}`;
    const options = {
        method: "GET",
    };

    return await authorizedFetch(url, options, token);
}

export async function deleteDeploymentRequest(workflowId: string, token: any){
    const url = `${URL}/workflows/deploy/${workflowId}`;
    const options = {
        method: "DELETE",
    };

    return await authorizedFetch(url, options, token);
}