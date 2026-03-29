"use client";

import { Node } from "reactflow"
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor"

import { Input } from "@/components/ui/input"
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import {WorkflowEditorActionType} from "@/constants";

export function TriggerNodeConfigSheet({ node, open, onOpen }: { node: Node, open: boolean, onOpen: (open: boolean) => void }) {
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
        <SheetWrapper open={open} onOpenChange={onOpen} title="Trigger Node">
            <div className="space-y-5 mt-4">

                {/* TRIGGER TYPE */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Trigger Type</label>
                    <Select
                        value={config?.triggerType ?? "manual"}
                        onValueChange={(value) => updateConfig({ triggerType: value as any })}
                    >
                        <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual" className="text-xs">Manual</SelectItem>
                            <SelectItem value="webhook" className="text-xs">Webhook</SelectItem>
                            <SelectItem value="schedule" className="text-xs">Schedule</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* NAME */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Name</label>
                    <Input
                        value={config?.name ?? ""}
                        onChange={(e) => updateConfig({ name: e.target.value })}
                        placeholder="Trigger Node Name"
                        className="text-xs h-8"
                    />
                </div>

                {/* SCHEDULE CRON */}
                {config?.triggerType === "schedule" && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium">Cron Expression</label>
                        <Input
                            value={config.cron ?? ""}
                            onChange={(e) => updateConfig({ cron: e.target.value })}
                            placeholder="* * * * *"
                            className="text-xs h-8"
                        />
                    </div>
                )}

                {/* WEBHOOK URL */}
                {config?.triggerType === "webhook" && (
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-medium">Webhook URL</label>
                        <Input
                            value={config?.webhookUrl ?? ""}
                            onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
                            placeholder="https://example.com/webhook"
                            className="text-xs h-8"
                        />
                    </div>
                )}

            </div>
        </SheetWrapper>
    )
}