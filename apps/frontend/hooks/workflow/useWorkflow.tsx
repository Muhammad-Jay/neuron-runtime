"use client"

import { useState, useCallback } from "react"
import {WorkflowType} from "../../../shared/src/types/workflow.types";

export const useWorkflow = ({
                                workflow,
                                clickAction,
                                deleteAction,
                            }: {
    workflow: WorkflowType
    clickAction: (id: string) => Promise<void>
    deleteAction: (id: string) => Promise<void>
}) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = useCallback(async () => {
        try {
            setIsClicked(true)
            await clickAction(workflow.id)
        } finally {
            setIsClicked(false)
        }
    }, [workflow.id, clickAction])

    const handleDelete = useCallback(async () => {
        try {
            setIsDeleting(true)
            await deleteAction(workflow.id)
        } finally {
            setIsDeleting(false)
        }
    }, [workflow.id, deleteAction])

    return {
        isDeleting,
        isClicked,
        handleClick,
        handleDelete,
    }
}