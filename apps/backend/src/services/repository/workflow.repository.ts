import {db} from "../../db/client";
import {
    NewWorkflow,
    NewWorkflowVersion,
    Workflow,
    WorkflowNode,
    WorkflowEdge,
    WorkflowVersion
} from "../../types/workflow/workflow.types";
import {and, desc, eq} from "drizzle-orm";
import {workflowEdges, workflowNodes, workflows, workflowVersions} from "../../schemas";
import {convertNodeToDBSchema} from "../../utils/node";
import {convertEdgeToDBSchema} from "../../utils/edge";

export async function createWorkflow(
    data: NewWorkflow
): Promise<Workflow> {
    try {
        console.log(data)
        const [workflow] = await db
            .insert(workflows)
            .values(data)
            .returning()

        return workflow as Workflow;
    }catch (e) {
        console.log(e)
        throw e;
    }
}

export async function getWorkflowById(
    workflowId: string,
    userId: string
): Promise<Workflow | null> {
    const workflow = await db.query.workflows.findFirst({
        where: and(
            eq(workflows.id, workflowId),
            eq(workflows.userId, userId)
        ),
    })

    return workflow ?? null
}

export async function getWorkflowsByUser(
    userId: string
): Promise<Workflow[]> {
    return db.query.workflows.findMany({
        where: eq(workflows.userId, userId),
        orderBy: desc(workflows.createdAt),
    })
}

export async function createWorkflowVersion(
    data: NewWorkflowVersion
): Promise<WorkflowVersion> {
    console.log(`Workflow Data Received: ${data}`)
    const [version] = await db
        .insert(workflowVersions)
        .values(data)
        .returning()

    return version as WorkflowVersion;
}

export async function getLatestWorkflowVersion(
    workflowId: string
): Promise<WorkflowVersion | null> {
    const version = await db.query.workflowVersions.findFirst({
        where: eq(workflowVersions.workflowId, workflowId),
        orderBy: desc(workflowVersions.versionNumber),
    })

    return version ?? null
}

export async function getWorkflowGraph({
                                           workflowId,
                                           userId,
                                       }: {
    workflowId: string;
    userId: string;
}): Promise< {
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
}> {
    // 1️⃣ Ensure workflow belongs to user
    const workflow = await db.query.workflows.findFirst({
        where: and(
            eq(workflows.id, workflowId),
            eq(workflows.userId, userId)
        ),
    });

    if (!workflow) {
        throw new Error("Workflow not found or unauthorized");
    }

    //  Nodes
    const dbWorkflowNodes = await db
        .select()
        .from(workflowNodes)
        .where(eq(workflowNodes.workflowId, workflowId));

    //  Edges
    const dbWorkflowEdges = await db
        .select()
        .from(workflowEdges)
        .where(eq(workflowEdges.workflowId, workflowId));

    return {
        nodes: dbWorkflowNodes,
        edges: dbWorkflowEdges,
    };
}


interface SaveWorkflowGraphInput {
    workflowId: string;
    userId: string;
    nodesData: any[];
    edgesData: any[];
}

export async function saveWorkflowGraph({
                                            workflowId,
                                            userId,
                                            nodesData,
                                            edgesData,
                                        }: SaveWorkflowGraphInput) {
    return await db.transaction(async (tx) => {
        // 1️⃣ Verify ownership
        const workflow = await tx.query.workflows.findFirst({
            where: and(
                eq(workflows.id, workflowId),
                eq(workflows.userId, userId)
            ),
        });

        if (!workflow) {
            throw new Error("Workflow not found or unauthorized");
        }

        // 2️⃣ Delete existing graph
        await tx.delete(workflowNodes).where(eq(workflowNodes.workflowId, workflowId));
        await tx.delete(workflowEdges).where(eq(workflowEdges.workflowId, workflowId));

        // 3️⃣ Insert nodes
        if (nodesData.length > 0) {
            await tx.insert(workflowNodes).values(
                nodesData.map((node) => {
                   const formatedNode = convertNodeToDBSchema(node);

                   return ({
                       ...formatedNode,
                       workflowId,
                   })
                })
            );
        }

        // 4️⃣ Insert edges
        if (edgesData.length > 0) {
            await tx.insert(workflowEdges).values(
                edgesData.map((edge) => {
                    const formatedEdge = convertEdgeToDBSchema(edge);

                    return ({
                        ...formatedEdge,
                        workflowId,
                    })
                })
            );
        }

        return {
            nodes: nodesData,
            edges: edgesData,
        };
    });
}

interface AddNodeInput {
    workflowId: string;
    userId: string;
    node: {
        id: string;
        type: string;
        position: { x: number; y: number };
        config: any;
    };
}

export async function addNodeToWorkflow({
                                            workflowId,
                                            userId,
                                            node,
                                        }: AddNodeInput) {
    return await db.transaction(async (tx) => {
        // 1️⃣ Verify ownership
        const workflow = await tx.query.workflows.findFirst({
            where: and(
                eq(workflows.id, workflowId),
                eq(workflows.userId, userId)
            ),
        });

        if (!workflow) {
            throw new Error("Workflow not found or unauthorized");
        }

        // 2️⃣ Insert node
        const [insertedNode] = await tx
            .insert(workflowNodes)
            .values({
                id: node.id,
                workflowId,
                type: node.type,
                positionX: node.position.x,
                positionY: node.position.y,
                config: node.config,
            })
            .returning();

        return insertedNode;
    });
}