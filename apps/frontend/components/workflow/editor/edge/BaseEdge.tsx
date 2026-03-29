"use client"

import { BaseEdge, EdgeProps } from "reactflow"
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor"

export default function WorkflowEdge(props: EdgeProps) {

    const { id } = props

    const { editorState } = useWorkflowEditor()

    const isActive = editorState.runtime?.activeEdges?.[id]

    return (
        <BaseEdge
            {...props}
            style={{
                stroke: isActive ? "#a3a3a3" : "#989898",
                strokeWidth: isActive ? 2 : 1,
                strokeDasharray: isActive ? "6 4" : "none",
                animation: isActive ? "dash 1s linear infinite" : "none"
            }}
        />
    )
}