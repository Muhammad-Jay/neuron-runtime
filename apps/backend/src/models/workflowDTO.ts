

export type workflowStatus = "draft" | "active" | "archived";

export interface WorkflowDTO {
    id: string
    name: string
    description: string | null
    runs?: number
    isActive: boolean
    status: workflowStatus,
    createdAt: string
    updatedAt?: string;
}

