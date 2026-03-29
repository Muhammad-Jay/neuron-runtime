import {deployedWorkflows} from "../schemas";
import {db} from "../db/client";
import {and, eq} from "drizzle-orm";
import {supabase} from "../middleware/supabaseAuth";
import {NewDeployedWorkflow} from "../types/workflow/workflow.types";
import {
    deleteDeploymentByWorkflowId,
    getDeploymentByWorkflowId,
    saveDeployWorkflowData
} from "../services/repository/deployed.workflow.repository";
import {executeWorkflow} from "../engine/execution";


export const deployWorkflowController = async (req: any, res: any) => {
   try {
       console.log("[Neuron] Deploying Workflow...");
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

       const body = req.body;

       const data: NewDeployedWorkflow = {
           userId,
           workflowId,
           name: body?.name ?? "Deploy",
           nodes: body.nodes,
           edges: body.edges,
           secretKey: body.secretKey,
           private: body.private,
           isActive: true
       }

       console.log("Deploying Workflow...");

       const deployment = await saveDeployWorkflowData(workflowId, data);

       return res.status(200).json(deployment);
   }catch (e: any) {

       console.log(e);
       return res.status(500).json({
           error: "Internal server error",
           message: e.message,
       });
   }
}


export const getDeploymentController = async (req: any, res: any) => {
    try {
        console.log("[Neuron] Deployments...");
        const { workflowId } = req.params as any;

        if (!workflowId) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        const deployment = await getDeploymentByWorkflowId(workflowId);

        console.log("fetching deployed Workflow with date: ", deployment);

        return res.status(200).json(deployment ? {
            id: deployment.id,
            name: deployment.name,
            private: deployment.private,
            isActive: deployment.isActive,
            createdAt: deployment.createdAt,
            updatedAt: deployment.updatedAt,
        } : null);
    }catch (e: any) {

        console.log(e);
        return res.status(500).json({
            error: "Internal server error",
            message: e.message,
        });
    }
}


export const deleteDeploymentController = async (req: any, res: any) => {
    const { workflowId } = req.params;

    try {
        // We call your existing service function
        const deleted = await deleteDeploymentByWorkflowId(workflowId);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "No active deployment found for this workflow."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orchestration terminated successfully.",
            data: deleted
        });
    } catch (error) {
        console.error("[Neuron Delete Error]:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Kernel Error while dismantling deployment."
        });
    }
};

export const executeDeployedWorkflowController = async (req: any, res: any) => {
    const workflowId = req.params.workflowId;
    // const apiKey = req.workflowKey;

    try {

        const [deployment] = await db
            .select({
                id: deployedWorkflows.id,
                nodes: deployedWorkflows.nodes,
                edges: deployedWorkflows.edges,
                isPrivate: deployedWorkflows.private,
                isActive: deployedWorkflows.isActive,
            })
            .from(deployedWorkflows)
            .where(
                and(
                    eq(deployedWorkflows.id, workflowId),
                    eq(deployedWorkflows.isActive, true)
                )
            )
            .limit(1);

        if (!deployment) {
            return res.status(404).json({
                success: false,
                error: "Target Not Found",
                message: "No active workflow matches the provided security payload."
            });
        }

        console.log(`[Neuron] Initializing execution for: ${deployment.id}`);

        // await neuronEngine.run(deployment.nodes, deployment.edges);
        await executeWorkflow(workflowId, { nodes: deployment.nodes, edges: deployment.edges } as any)
            .then((finalContext) => {
                console.log(`Workflow ${workflowId} finished.`);

                const { status, body, headers } = finalContext.response;

                if (headers) {
                    res.set(headers);
                }

                return res.status(status || 200).json(body);

                // return res.status(200).json({
                //     success: true,
                //     message: "Workflow executed successfully.",
                //     // Optional: return context in dev mode
                //     // data: finalContext.nodesContext
                // });
            })
            .catch(err => {
                console.error(`Workflow ${workflowId} failed:`, err);
                return res.status(500).json({
                    success: false,
                    error: "Internal Workflow Execution Error",
                    message: err.message
                });
            });

    } catch (error) {
        console.error("[Neuron Error]:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Orchestration Failure",
            message: "The kernel encountered an error during key hydration."
        });
    }
};