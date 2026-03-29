"use client";

import {ReactFlowProvider} from "reactflow";
import {ReactNode} from "react";
import {NodeOutputProvider} from "@/providers/NodeOutputContext";
import {WorkflowEditorProvider} from "@/providers/WorkflowEditorProvider";

export const EditorProvider = ({ children }: { children: ReactNode }) => {

    return (
        <ReactFlowProvider>
            <NodeOutputProvider>
                <WorkflowEditorProvider>
                            {children}
                </WorkflowEditorProvider>
            </NodeOutputProvider>
        </ReactFlowProvider>
    )
}