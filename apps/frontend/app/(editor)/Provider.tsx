"use client";

import {ReactFlowProvider} from "reactflow";
import {ReactNode} from "react";
import {NodeOutputProvider} from "@/providers/NodeOutputContext";
import {WorkflowEditorProvider} from "@/providers/WorkflowEditorProvider";
import {ValidationProvider} from "@/providers/ValidationContext";

export const EditorProvider = ({ children }: { children: ReactNode }) => {

    return (
        <ReactFlowProvider>
            <NodeOutputProvider>
                <WorkflowEditorProvider>
                    <ValidationProvider>
                        {children}
                    </ValidationProvider>
                </WorkflowEditorProvider>
            </NodeOutputProvider>
        </ReactFlowProvider>
    )
}