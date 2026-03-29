import {executions} from "../../schemas";
import {db} from "../../db/client";
import type {Execution, NewExecution} from "../../types/workflow/workflow.types";
import {eq} from "drizzle-orm";
import type {ExecutionStatus} from "../../types/types";

export async function createExecution(
    data: NewExecution
): Promise<Execution> {
    const [execution] = await db
        .insert(executions)
        .values(data)
        .returning()

    return execution as Execution;
}

export async function updateExecutionStatus(
    executionId: string,
    status: ExecutionStatus,
    result?: unknown
): Promise<void> {
    await db
        .update(executions)
        .set({
            status,
            finishedAt: new Date(),
            result,
        })
        .where(eq(executions.id, executionId))
}

