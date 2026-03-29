import {Router} from "express";
import {executeDeployedWorkflowController} from "../controllers/deploy.workflow.controller";

const router = Router();

router.get("/:workflowId", executeDeployedWorkflowController);

export default router;