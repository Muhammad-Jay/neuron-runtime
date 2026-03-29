import { Router } from "express";
import {
    addNodeController,
    createWorkflowController, executeWorkflowController, fetchWorkflowGraphController,
    getWorkflowController, saveWorkflowGraphController,
    // executeWorkflowController
} from "../controllers/workflow.controllers";
import {authenticate} from "../middleware/supabaseAuth";
import {getWorkflowById, getWorkflowGraph, saveWorkflowGraph} from "../services/repository/workflow.repository";
import {
    deleteDeploymentController,
    deployWorkflowController, executeDeployedWorkflowController,
    getDeploymentController
} from "../controllers/deploy.workflow.controller";
import {requireKey} from "../middleware/auth";

const router = Router();

// Get workflows
router.get("/", authenticate, getWorkflowController);

// Create a workflow
router.post("/", authenticate, createWorkflowController);

router.get("/:workflowId/graph", authenticate, fetchWorkflowGraphController);

router.post("/:workflowId/graph", authenticate, saveWorkflowGraphController);

router.post("/:workflowId/nodes", authenticate, addNodeController);

// Get a workflow by ID
// router.get("/:id", authenticate, getWorkflowById);

// Execute a workflow
router.get("/execute/:workflowId", authenticate, executeWorkflowController);

// Deploy a workflow
router.post("/deploy/:workflowId", authenticate, deployWorkflowController);
router.get("/deploy/:workflowId", authenticate, getDeploymentController);
router.delete("/deploy/:workflowId", authenticate, deleteDeploymentController);

export default router;