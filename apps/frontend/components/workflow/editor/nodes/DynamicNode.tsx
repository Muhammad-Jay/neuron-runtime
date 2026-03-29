'use client';

import { NodeProps, Position } from "reactflow";
import {useMemo, useEffect, useCallback, useState} from "react";

import { Card, CardContent } from "@/components/ui/card";
import { ContextMenuItem } from "@/components/ui/context-menu";
import { NodeHandle } from "./NodeHandle";

import {cn, getNodeColor, getNodeStatusStyles, getPreviousNode, nodePropsToReactflowNode} from "@/lib/utils";
import { Cpu, Zap, Bug } from "lucide-react";

import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { WorkflowEditorActionType } from "@/constants";
import { ContextMenuWrapper } from "@/components/workflow/editor/ContextMenuWrapper";

import { ReactNode } from "react";
import {NodeStatusIndicator} from "@/components/workflow/editor/nodes/NodeStatusIndicator";
import {NodePreview} from "@/components/workflow/editor/nodes/NodePreview";
import {DecisionNodeHandlesRenderer} from "@/components/workflow/editor/nodes/DecisionNodeHandlesRenderer";
import {DynamicNodeToolbar} from "@/components/workflow/editor/nodes/toolbar/DynamicNodeToolbar";

const ICON_MAP: Record<string, ReactNode> = {
    trigger: <Zap  size={50}  className="text-amber-500" />,
    httpNode: <Cpu  size={50}  className="text-blue-500" />,
    debug: <Bug size={50} className="text-red-500" />,
};

export default function DynamicNode(node: NodeProps) {
    const { id, selected, data, type } = node;

    const {
        editorState,
        workflowEditorDispatch,
        setSheetOpen,
        setSelectedNode,
        isRunning,
    } = useWorkflowEditor();

    const color = getNodeColor(type);

    const status = editorState.runtime?.nodeStatus?.[id] ?? "idle"
    const output = editorState.runtime.nodeOutputs?.[id] || editorState.runtime.nodeErrors?.[id];

    const statusClass = getNodeStatusStyles(status);

    const handleMenuClick = (action: string) => {

        switch (action) {

            case "delete":
                workflowEditorDispatch({
                    type: WorkflowEditorActionType.DELETE_NODE,
                    id
                });
                break;

            case "edit":
                setSelectedNode(nodePropsToReactflowNode(node));
                setSheetOpen(true);
                break;

        }

    };

    return (

        <ContextMenuWrapper
            className={"group"}
            trigger={
                <Card
                    onContextMenu={(e) => e.stopPropagation()}
                    className={cn(
                        "group flex flex-col gap-1.5 w-[200px] h-fit transition-all p-3 bg-neutral-800/25 backdrop-blur-sm border-0 rounded-xl relative",
                        statusClass,
                        selected && "ring-2! ring-primary! shadow-primary",
                    )}
                >

                    {/* Toolbar */}
                    <DynamicNodeToolbar
                        nodeId={node.id}
                        nodeType={node.type}
                        config={node.data.config}
                        isVisible={selected}
                        onSettingsClick={() => {
                            setSelectedNode(nodePropsToReactflowNode(node));
                            setSheetOpen(true);
                        }}
                    />

                    {/* Handles */}

                    <NodeHandle
                        className={cn("-left-[35px]!",
                            node?.type === "trigger" && "hidden",
                        )}
                        node={node}
                        type="target"
                        position={Position.Left}
                    />

                    <NodeHandle
                        className={cn("-right-[35px]!",
                            node?.type === "condition" && "hidden",
                            node?.type === "decisionNode" && "hidden"
                        )}
                        node={node}
                        type="source"
                        position={Position.Right}
                    />

                    <DecisionNodeHandlesRenderer node={node} />

                    {node?.type === "condition" && (
                        <>
                            <NodeHandle
                                className="top-[35%]! -right-[35px]! bg-green-500/30!"
                                node={node}
                                type="source"
                                id={"true"}
                                position={Position.Right}
                            />

                            <NodeHandle
                                className="top-[65%]! -right-[35px]! bg-red-500/30!"
                                node={node}
                                id={"false"}
                                type="source"
                                position={Position.Right}
                            />
                        </>
                    )}




                    {/* Title */}

                    <Card
                        className={cn(
                            "flex flex-col container-full rounded-xl border-0 h-full transition p-2",
                            "bg-neutral-900/50 group-hover:bg-neutral-800"
                        )}
                    >

                        <CardContent className="p-0 flex gap-2.5 flex-grow items-center justify-start">

                            {ICON_MAP[data.type] || (
                                <Cpu size={50} className={cn("m-0 container-full",color.text)} />
                            )}

                            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                {node.type?.replace('_', ' ')}
              </span>

                            <div className={'w-full h-fit gap-2.5 center justify-end!'}>
                                <span className={'text-xs text-secondary-foreground'}>{status}</span>
                                <NodeStatusIndicator status={status}/>
                            </div>
                        </CardContent>

                    </Card>

                    {node.type === "decisionNode" && (
                        <Card
                            className={cn(
                                "flex flex-col rounded-xl border-0 h-full transition p-2",
                                "bg-neutral-900/50 group-hover:bg-neutral-800"
                            )}
                        >

                            <CardContent className="p-0 mt-2 flex min-h-[60px] flex-grow items-center justify-start">
                                 <span className="text-[11px] text-neutral-300 font-medium">
                      {data?.label || ""}
                    </span>

                            </CardContent>

                        </Card>
                    )}

                    <Card
                        className={cn(
                            "flex flex-col container-full rounded-xl border-0 h-full transition p-2",
                            "bg-neutral-900/50 group-hover:bg-neutral-800",
                            color.bg
                        )}
                    >

                        <CardContent className="p-0 mt-2 flex flex-grow items-center justify-start">

              <span className="text-[11px] text-neutral-300 font-medium">
                {node.type || "Untitled Node"}
              </span>

                        </CardContent>

                    </Card>

                </Card>
            }
        >

            <ContextMenuItem
                className="cursor-pointer"
                onClick={() => handleMenuClick("edit")}
            >
                Edit Configuration
            </ContextMenuItem>

            <ContextMenuItem
                className="text-red-500 cursor-pointer focus:bg-red-500/10 focus:text-red-500"
                onClick={() => handleMenuClick("delete")}
            >
                Delete Node
            </ContextMenuItem>

        </ContextMenuWrapper>
    );
}