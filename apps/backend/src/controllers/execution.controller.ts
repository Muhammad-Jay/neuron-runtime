import { Request, Response } from "express";

import {
    createExecution,
    getExecutionsByUser,
    getExecutionsByWorkflow,
    getExecutionById,
    updateExecutionStatus,
    deleteExecution,
    deleteExecutionsByWorkflow,
    getExecutionMetrics,
    getRecentExecutions,
} from "../services/repository/execution.repository";

export type AuthRequest = Request & {
    user: { id: string };
    params: {
        executionId?: string;
        workflowId?: string;
    }
};

function handleError(res: Response, err: unknown, message: string) {
    return res.status(500).json({
        message,
    });
}

export async function createExecutionController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user.id;
        const { workflowId, workflowVersionId } = req.body;

        if (!workflowId || !workflowVersionId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const execution = await createExecution({
            workflowId,
            workflowVersionId,
            userId,
        });

        return res.status(201).json(execution);
    } catch (err) {
        return handleError(res, err, "Failed to create execution");
    }
}

export async function getExecutionsController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user.id;

        const executions = await getExecutionsByUser(userId);

        return res.status(200).json(executions);
    } catch (err) {
        return handleError(res, err, "Failed to fetch executions");
    }
}

export async function getExecutionsByWorkflowController(
    req: AuthRequest,
    res: Response
) {
    try {
        const userId = req.user.id;
        const { workflowId } = req.params;

        if (!workflowId) {
            return res.status(400).json({ message: "Missing workflowId" });
        }

        const executions = await getExecutionsByWorkflow(userId, workflowId);

        return res.status(200).json(executions);
    } catch (err) {
        return handleError(res, err, "Failed to fetch workflow executions");
    }
}

export async function getExecutionByIdController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user.id;
        const { executionId } = req.params;

        if (!executionId) {
            return res.status(400).json({ message: "Missing executionId" });
        }

        const execution = await getExecutionById(userId, executionId);

        if (!execution) {
            return res.status(404).json({ message: "Execution not found" });
        }

        return res.status(200).json(execution);
    } catch (err) {
        return handleError(res, err, "Failed to fetch execution");
    }
}

export async function updateExecutionStatusController(
    req: AuthRequest,
    res: Response
) {
    try {
        const userId = req.user.id;
        const { executionId } = req.params;
        const { status, finishedAt, result } = req.body;

        if (!executionId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updated = await updateExecutionStatus({
            executionId,
            userId,
            status,
            finishedAt,
            result,
        });

        if (!updated) {
            return res.status(404).json({ message: "Execution not found" });
        }

        return res.status(200).json(updated);
    } catch (err) {
        return handleError(res, err, "Failed to update execution");
    }
}

export async function deleteExecutionController(req: AuthRequest, res: Response) {
    try {
        const userId = req.user.id;
        const { executionId } = req.params;

        if (!executionId) {
            return res.status(400).json({ message: "Missing executionId" });
        }

        const deleted = await deleteExecution(userId, executionId);

        if (!deleted) {
            return res.status(404).json({ message: "Execution not found" });
        }

        return res.status(200).json({ message: "Execution deleted" });
    } catch (err) {
        return handleError(res, err, "Failed to delete execution");
    }
}

export async function deleteExecutionsByWorkflowController(
    req: AuthRequest,
    res: Response
) {
    try {
        const userId = req.user.id;
        const { workflowId } = req.params as any;

        if (!workflowId) {
            return res.status(400).json({ message: "Missing workflowId" });
        }

        await deleteExecutionsByWorkflow(userId, workflowId);

        return res.status(200).json({ message: "Executions deleted" });
    } catch (err) {
        return handleError(res, err, "Failed to delete executions");
    }
}

export async function getExecutionMetricsController(
    req: AuthRequest,
    res: Response
) {
    try {
        const userId = req.user.id;

        const metrics = await getExecutionMetrics(userId);

        return res.status(200).json(metrics);
    } catch (err) {
        return handleError(res, err, "Failed to fetch metrics");
    }
}

export async function getRecentExecutionsController(
    req: AuthRequest,
    res: Response
) {
    try {
        const userId = req.user.id;
        const limit = Number(req.query.limit) || 20;

        const executions = await getRecentExecutions(userId, limit);

        return res.status(200).json(executions);
    } catch (err) {
        return handleError(res, err, "Failed to fetch recent executions");
    }
}