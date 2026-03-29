import {db} from "../../db/client";
import {globalVariables} from "../../schemas";
import {and, desc, eq} from "drizzle-orm";
import {GlobalVariable} from "../../types/workflow/workflow.types";

export async function getGlobalVariables(workflowId: string): Promise<GlobalVariable[] | null> {
    if (!workflowId) throw Error(`Missing workflow id, workflow id must be provided.`);

    return db.query.globalVariables.findMany({
        where: eq(globalVariables.workflowId, workflowId),
        orderBy: desc(globalVariables.createdAt),
    }) ?? null;
}


export async function saveGlobalVariables(
    workflowId: string,
    variables: GlobalVariable[]
): Promise<GlobalVariable[]> {
    return await db.transaction(async (tx) => {

        await tx.delete(globalVariables).where(eq(globalVariables.workflowId, workflowId));

        if (variables.length > 0) {
            await tx.insert(globalVariables).values(
                variables.map((v) => ({
                    key: v.key,
                    value: v.value,
                    type: v.type ?? "string",
                    workflowId: workflowId,
                    updatedAt: new Date(),
                }))
            );
        }

        console.log(`[Lazarus Engine] Registry Synced: ${variables.length} variables for ${workflowId}`);
        return variables;
    });
}


export async function getGlobalVariableByWorkflowAndKey(
    workflowId: string,
    key: string
): Promise<GlobalVariable | null> {
    const result = await db.query.globalVariables.findFirst({
        where: and(
            eq(globalVariables.workflowId, workflowId),
            eq(globalVariables.key, key)
        )
    });

    return result ?? null;
}