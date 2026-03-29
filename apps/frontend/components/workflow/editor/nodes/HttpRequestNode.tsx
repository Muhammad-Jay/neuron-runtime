'use client';

import { NodeProps, Handle, Position } from "reactflow";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ContextMenuItem } from "@/components/ui/context-menu";
import {ContextMenuWrapper} from "@/components/workflow/editor/ContextMenuWrapper";
import {cn} from "@/lib/utils";
import {useWorkflowEditor} from "@/hooks/workflow/useWorkflowEditor";

export default function HttpRequestNode(node: NodeProps) {
    const { id, selected, data } = node;

    const { setOpenConfigSheet } = useWorkflowEditor();

    return (
        <ContextMenuWrapper
            trigger={
                /* The Card is the trigger for the right-click */
                <Card
                    className={cn(
                        "hover:shadow-lg group flex-col h-[150px] w-[200px] transition p-3 bg-neutral-800/20 backdrop-blur-sm border-0 rounded-xl",
                        selected && "ring-2 ring-primary"
                    )}
                >
                    {/* ReactFlow Handles: Required for connectivity */}
                    <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary" />

                    <Card className="justify-between container-full card-surface flex-col rounded-xl border-0 h-full bg-transparent">
                        <CardHeader className="p-0 center">
                            <span className="text-xs uppercase font-bold text-secondary-foreground">HTTP Request</span>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-grow items-center justify-center">

                        </CardContent>
                    </Card>

                    <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-primary" />
                </Card>
            }
        >
            {/* These are the items that appear on right-click */}
            <ContextMenuItem className="cursor-pointer" onClick={() => setOpenConfigSheet(true)}>
                Edit Node
            </ContextMenuItem>
            <ContextMenuItem className="cursor-pointer" onClick={() => console.log("Copy", id)}>
                Duplicate
            </ContextMenuItem>
            <ContextMenuItem
                className="text-red-500 cursor-pointer"
                onClick={() => console.log("Delete", id)}
            >
                Delete
            </ContextMenuItem>
        </ContextMenuWrapper>
    );
}