import { Response } from "express";
import { AuthRequest } from "./execution.controller";
import {
    createWorkspace,
    deleteWorkspace,
    getWorkspacesByUser,
    moveWorkflowToWorkspace,
    updateWorkspace
} from "../services/repository/workspace.repository";

export async function createWorkspaceController(req: AuthRequest, res: Response) {
    try {
        console.log("Creating new workspace...");
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const workspace = await createWorkspace({ userId, name, description });
        return res.status(201).json(workspace);
    } catch (error: any) {
        console.error("Create Workspace Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function getWorkspacesController(req: AuthRequest, res: Response) {
    try {
        console.log("Loading Workspaces...");
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const workspaces = await getWorkspacesByUser(userId);
        return res.status(200).json({ data: workspaces });
    } catch (error: any) {
        console.error("Get Workspaces Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateWorkspaceController(req: AuthRequest, res: Response) {
    try {
        console.log("Updating Workspace...");
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params as any;
        const updated = await updateWorkspace({ id, userId, data: req.body });

        if (!updated) return res.status(404).json({ error: "Workspace not found" });
        return res.status(200).json(updated);
    } catch (error: any) {
        console.error("Update Workspace Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteWorkspaceController(req: AuthRequest, res: Response) {
    try {
        console.log("Deleting Workspace...");
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { id } = req.params as any;
        await deleteWorkspace(id, userId);

        return res.status(204).send();
    } catch (error: any) {
        console.error("Delete Workspace Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function assignWorkflowToWorkspaceController(req: AuthRequest, res: Response) {
    try {
        console.log("Assigning Workspace...");
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const { workflowId, workspaceId } = req.body;

        if (!workflowId) {
            return res.status(400).json({ error: "Workflow ID is required" });
        }

        const result = await moveWorkflowToWorkspace({
            workflowId,
            workspaceId: workspaceId || null,
            userId
        });

        return res.status(200).json({
            message: "Workflow reassigned successfully",
            result
        });
    } catch (error: any) {
        console.error("Assign Workflow Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}