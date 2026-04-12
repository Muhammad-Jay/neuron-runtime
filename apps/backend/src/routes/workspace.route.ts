import { Router } from 'express';
import {
    createWorkspaceController,
    deleteWorkspaceController,
    getWorkspacesController,
    updateWorkspaceController,
    assignWorkflowToWorkspaceController
} from '../controllers/workspace.controller';
import {authenticate} from "../middleware/supabaseAuth";

const router = Router();

router.use(authenticate);

/**
 * @route   GET /api/workspaces
 * @desc    Fetch all workspaces for the authenticated user
 */
router.get('/', getWorkspacesController);

/**
 * @route   POST /api/workspaces
 * @desc    Create a new workspace group
 */
router.post('/', createWorkspaceController);

/**
 * @route   PATCH /api/workspaces/:id
 * @desc    Update workspace metadata (name/description)
 */
router.patch('/:id', updateWorkspaceController);

/**
 * @route   DELETE /api/workspaces/:id
 * @desc    Remove a workspace (workflows will be unassigned, not deleted)
 */
router.delete('/:id', deleteWorkspaceController);

/**
 * @route   POST /api/workspaces/assign-workflow
 * @desc    The Drag & Drop endpoint to move a workflow into/out of a workspace
 */
router.post('/assign-workflow', assignWorkflowToWorkspaceController);

export default router;