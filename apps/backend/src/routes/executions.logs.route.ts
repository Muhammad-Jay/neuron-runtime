import { Router } from "express";
import { authenticate } from "../middleware/supabaseAuth";
import {
    createExecutionLogController,
    updateExecutionLogController,
    getExecutionLogsController,
    deleteExecutionLogsController,
} from "../controllers/execution.logs.controller";

const router = Router();

// --- Global Middleware ---
// All log operations require an authenticated session
router.use(authenticate);

/**
 * @route   POST /api/logs
 * @desc    Append a new entry to an execution log
 */
router.post("/", createExecutionLogController);

/**
 * @route   GET /api/logs/:executionId
 * @desc    Retrieve all logs associated with a specific execution run
 */
router.get("/:executionId", getExecutionLogsController);

/**
 * @route   PATCH /api/logs/:logId
 * @desc    Update an existing log entry (e.g., status updates or metadata)
 */
router.patch("/:logId", updateExecutionLogController);

/**
 * @route   DELETE /api/logs/:executionId
 * @desc    Purge log history for a specific execution
 */
router.delete("/:executionId", deleteExecutionLogsController);

export default router;