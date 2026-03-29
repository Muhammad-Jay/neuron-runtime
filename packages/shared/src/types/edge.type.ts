export interface WorkflowEdge {
    id: string
    source: string
    target: string
    workflowId?: string
    config?: any
    sourceHandle?: string
    targetHandle?: string
}