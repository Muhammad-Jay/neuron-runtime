'use client';

import {WorkflowEditorContext} from "@/providers/WorkflowEditorProvider";
import {useContext} from "react";

export function useWorkflowEditor() {
    const context = useContext(WorkflowEditorContext);
    if (!context) throw new Error("Must be used inside provider");
    return context;
}