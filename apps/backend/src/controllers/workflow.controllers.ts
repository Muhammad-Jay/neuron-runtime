import type {Request, Response} from "express";
import {
    addNodeToWorkflow,
    createWorkflow,
    getWorkflowById,
    getWorkflowGraph,
    getWorkflowsByUser, saveWorkflowGraph
} from "../services/repository/workflow.repository";
import {supabase} from "../middleware/supabaseAuth";
import {toWorkflowDTO} from "../utils/workflow";
import {executeWorkflow} from "../engine/execution";
import {getGlobalVariables, saveGlobalVariables} from "../services/repository/global.variables.repository";
import {WorkflowNode, WorkflowEdge} from "../types/workflow/workflow.types";
import {createExecution, updateExecutionStatus} from "../services/repository/execution.repository";
import {AuthRequest} from "./execution.controller";

// POST /api/workflows
export const createWorkflowController = async (req: AuthRequest, res: Response) => {
    try {
        console.log("Creating workflow...");
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const workflow = await createWorkflow(req.body);
        res.status(201).json(workflow);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// GET /api/workflows
export const getWorkflowController = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const workflows = await getWorkflowsByUser(user.id);

        // 3. Check for Data Existence
        if (!workflows || workflows.length === 0) {
            // THE CRITICAL RETURN: If this is missing, the code below still runs!
            return res.status(404).json({ message: "No workflows found" });
        }

        // 4. Formatting logic
        const formatedWorkflows = workflows.map(w => toWorkflowDTO(w));

        // 5. Final Successful Response
        return res.json({ data: formatedWorkflows });

    } catch (error) {
        console.error("Controller Error:", error);

        // Final Safety Check: Don't try to send a 500 if we already sent a 401/404
        if (!res.headersSent) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
};


export async function fetchWorkflowGraphController(
    req: AuthRequest,
    res: Response
) {
    console.log("fetching workflow graph...");
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        // Get workflowId from params
        const { workflowId } = req.params as any;

        if (!workflowId) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        // Graph
        const graph = await getWorkflowGraph({
            workflowId,
            userId,
        });

        const globalVariables = await getGlobalVariables(workflowId);

        return res.status(200).json({ graph, globalVariables });
    } catch (error: any) {
        console.error("Fetch Workflow Graph Error:", error);

        if (error.message === "Workflow not found or unauthorized") {
            return res.status(404).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Internal server error",
        });
    }
}


export async function saveWorkflowGraphController(
    req: AuthRequest,
    res: Response
) {
    try {
        console.log("Saving Graph...")
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        // 3️⃣ Get workflowId
        const { workflowId } = req.params as any;

        if (!workflowId) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        const graph = req.body?.graph;
        const nodes = graph?.nodes || [];
        const edges = graph?.edges || [];
        const globalVariables = req.body?.globalVariables || [];

        if (!Array.isArray(nodes) || !Array.isArray(edges) || !Array.isArray(globalVariables)) {
            return res.status(400).json({
                error: "Invalid graph format",
            });
        }

        // 5️⃣ Save graph
        const result = await saveWorkflowGraph({
            workflowId,
            userId,
            nodesData: nodes,
            edgesData: edges,
        });

        const variables = await saveGlobalVariables(workflowId, globalVariables);

        return res.status(200).json({
            message: "Graph saved successfully",
            result,
            variables,
        });
    } catch (error: any) {
        console.error("Save Workflow Graph Error:", error);

        if (error.message === "Workflow not found or unauthorized") {
            return res.status(404).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error: "Internal server error",
        });
    }
}



export async function addNodeController(
    req: AuthRequest,
    res: Response
) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const { workflowId } = req.params as any;

        if (!workflowId) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        const { node } = req.body;

        if (!node || !node.id || !node.type || !node.position) {
            return res.status(400).json({
                error: "Invalid node payload",
            });
        }

        const insertedNode = await addNodeToWorkflow({
            workflowId,
            userId,
            node,
        });

        return res.status(201).json(insertedNode);
    } catch (error: any) {
        if (error) {
            return res.status(error.statusCode).json({
                error: error.message,
            });
        }

        if (error.message === "Workflow not found or unauthorized") {
            return res.status(404).json({
                error: error.message,
            });
        }

        console.error("Add Node Error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

// POST /api/workflows/:id/execute
export const executeWorkflowController = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    const { workflowId } = req.params as any;

    const graph = await getWorkflowGraph({
        workflowId,
        userId,
    });

    // Sync to execution table
    const execution = await createExecution({
        workflowId,
        userId,
    })

    executeWorkflow(workflowId, graph, userId)
        .then(async finalContext => {
            // Update status (Success)
            await updateExecutionStatus({
                executionId: execution.id,
                status: "success",
                userId,
                result: finalContext,
            })
        })
        .catch(async err => {
            console.error(`Workflow ${workflowId} failed`, err)

            // Update status (Failed)
            await updateExecutionStatus({
                executionId: execution.id,
                status: "failed",
                userId,
                result: err?.message ?? err,
            })
        });

    res.status(202).json({ message: "Execution started", workflowId });
}