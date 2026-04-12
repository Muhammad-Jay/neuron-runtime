import { Router } from "express";
import {
    addNodeController,
    createWorkflowController,
    executeWorkflowController,
    getWorkflowController,
    getWorkflowFullStateController,
    saveWorkflowGraphController,
} from "../controllers/workflow.controllers";
import {
    createWorkspaceController,
    getWorkspacesController,
    updateWorkspaceController,
    deleteWorkspaceController,
    assignWorkflowToWorkspaceController
} from "../controllers/workspace.controller";
import { authenticate } from "../middleware/supabaseAuth";
import {
    deleteDeploymentController,
    deployWorkflowController,
    getDeploymentController
} from "../controllers/deploy.workflow.controller";

const router = Router();

// --- Global Middleware ---
// Protects all routes defined below this line
router.use(authenticate);

// --- Core Workflows ---
router.get("/", getWorkflowController);
router.post("/", createWorkflowController);

// --- Graph & State Management ---
router.get("/:workflowId/graph", getWorkflowFullStateController);
router.post("/:workflowId/graph", saveWorkflowGraphController);
router.post("/:workflowId/nodes", addNodeController);

// --- Execution & Deployment ---
router.get("/execute/:workflowId", executeWorkflowController);
router.post("/deploy/:workflowId", deployWorkflowController);
router.get("/deploy/:workflowId", getDeploymentController);
router.delete("/deploy/:workflowId", deleteDeploymentController);

// --- Workspace / Grouping Management ---
router.get("/workspaces", getWorkspacesController);
router.post("/workspaces", createWorkspaceController);
router.patch("/workspaces/:id", updateWorkspaceController);
router.delete("/workspaces/:id", deleteWorkspaceController);

// Drag & Drop action
router.post("/workspaces/assign-workflow", assignWorkflowToWorkspaceController);

export default router;