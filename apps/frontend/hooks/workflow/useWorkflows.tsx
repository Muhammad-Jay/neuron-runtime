"use client";

import {useContext} from "react";
import {WorkflowContext} from "@/providers/WorkflowProvider";

export const useWorkflows = () => {
    const context = useContext(WorkflowContext)
    if (!context)
        throw new Error("useWorkflows must be used within a WorkflowProvider")
    return context
}