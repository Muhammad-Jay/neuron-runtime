"use client";

import { Node } from "reactflow"
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor"

import { Input } from "@/components/ui/input"
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper"
import { Textarea } from "@/components/ui/textarea"
import {WorkflowEditorActionType} from "@/constants";

export function DebugNodeConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen: (open: boolean) => void }) {

    const { workflowEditorDispatch } = useWorkflowEditor()
    const config = node.data.config

    const updateConfig = (partial: Partial<typeof config>) => {
        workflowEditorDispatch({
            type: WorkflowEditorActionType.UPDATE_NODE,
            id: node.id,
            payload: {
                config: {
                    ...config,
                    ...partial
                }
            }
        })
    }

    return (
        <SheetWrapper open={open} onOpenChange={onOpen} title="Debug Node">

            <div className="space-y-5 mt-4">

                {/* NAME */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Name</label>
                    <Input
                        value={config.name ?? ""}
                        onChange={(e) => updateConfig({ name: e.target.value })}
                        placeholder="Debug Node Name"
                        className="text-xs h-8"
                    />
                </div>

                {/* DESCRIPTION */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Description</label>
                    <Textarea
                        value={config.description ?? ""}
                        onChange={(e) => updateConfig({ description: e.target.value })}
                        placeholder="Optional description..."
                        className="text-xs"
                    />
                </div>

                {/* LOG LEVEL */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Log Level</label>
                    <select
                        value={config.logLevel ?? "info"}
                        onChange={(e) => updateConfig({ logLevel: e.target.value })}
                        className="h-8 text-xs border rounded-md px-2"
                    >
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warn">Warn</option>
                        <option value="error">Error</option>
                    </select>
                </div>

            </div>

        </SheetWrapper>
    )
}