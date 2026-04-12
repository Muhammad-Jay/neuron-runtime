import { workspaces, workflows } from '../../schemas';
import { eq, and, desc } from 'drizzle-orm';
import {db} from "../../db/client";

export async function createWorkspace(data: { userId: string; name: string; description?: string }) {
    const [newWorkspace] = await db.insert(workspaces)
        .values({
            userId: data.userId,
            name: data.name,
            description: data.description,
        })
        .returning();
    return newWorkspace;
}

export async function getWorkspacesByUser(userId: string) {
    return await db.query.workspaces.findMany({
        where: eq(workspaces.userId, userId),
        with: { workflows: true },
        orderBy: [desc(workspaces.createdAt)],
    });
}

export async function updateWorkspace(params: { id: string; userId: string; data: any }) {
    const [updated] = await db.update(workspaces)
        .set({ ...params.data, updatedAt: new Date() })
        .where(and(eq(workspaces.id, params.id), eq(workspaces.userId, params.userId)))
        .returning();
    return updated;
}

export async function deleteWorkspace(id: string, userId: string) {
    return db.delete(workspaces)
        .where(and(eq(workspaces.id, id), eq(workspaces.userId, userId)));
}

export async function moveWorkflowToWorkspace(params: { workflowId: string; workspaceId: string | null; userId: string }) {
    const [updatedWorkflow] = await db.update(workflows)
        .set({ workspaceId: params.workspaceId })
        .where(and(eq(workflows.id, params.workflowId), eq(workflows.userId, params.userId)))
        .returning();
    return updatedWorkflow;
}