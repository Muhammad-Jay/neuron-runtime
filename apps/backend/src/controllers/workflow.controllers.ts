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

// POST /api/workflows
export const createWorkflowController = async (req: Request, res: Response) => {
    try {
        console.log("Creating workflow...");
        const workflow = await createWorkflow(req.body);
        res.status(201).json(workflow);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// GET /api/workflows
export const getWorkflowController = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Check for token
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader?.replace("Bearer ", "");
        const { data: { user }, error } = await supabase.auth.getUser(token);

        // 2. Check for Auth Error
        if (error || !user) {
            return res.status(401).json({
                message: "Unauthorized",
                details: error?.message
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
    req: Request,
    res: Response
) {
    console.log("fetching workflow graph...");
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing or invalid authorization token",
            });
        }

        const token = authHeader.replace("Bearer ", "");

        // Get user from Supabase
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const userId = user.id;

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
    req: Request,
    res: Response
) {
    try {
        console.log("Saving Graph...")
        //  Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing or invalid authorization token",
            });
        }

        const token = authHeader.replace("Bearer ", "");

        // 2️⃣ Validate user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const userId = user.id;

        // 3️⃣ Get workflowId
        const { workflowId } = req.params as any;

        if (!workflowId) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        // 4️⃣ Validate body
        const { graph: { nodes, edges }, globalVariables } = req.body;

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
    req: Request,
    res: Response
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Missing or invalid authorization token",
            });
        }

        const token = authHeader.replace("Bearer ", "");

        // 2️⃣ Validate user
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const userId = user.id;

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
export const executeWorkflowController = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Missing or invalid authorization token",
        });
    }

    const token = authHeader.replace("Bearer ", "");

    // 2️⃣ Validate user
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return res.status(401).json({
            error: "Unauthorized",
        });
    }

    const userId = user.id;

    const { workflowId } = req.params as any;

    const graph = await getWorkflowGraph({
        workflowId,
        userId,
    });

    executeWorkflow(workflowId, graph)
        .then(finalContext => console.log(`Workflow ${workflowId} finished`))
        .catch(err => console.error(`Workflow ${workflowId} failed`, err));

    res.status(202).json({ message: "Execution started", workflowId });
}