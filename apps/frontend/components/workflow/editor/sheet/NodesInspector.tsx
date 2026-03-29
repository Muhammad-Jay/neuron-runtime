"use client"

import React from 'react'
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor"
import {cn, getNodeColor, toReactFlowNode} from "@/lib/utils"
import { Cpu, Zap, Bug, ChevronRight } from "lucide-react"
import {EditorPanel} from "@/components/workflow/editor/EditorPanel";
import {WorkflowNode} from "../../../../../shared/src/types/node.types";
import {useReactFlow} from "reactflow";

const ICON_MAP: Record<string, React.ReactNode> = {
    trigger: <Zap className="w-3.5 h-3.5" />,
    httpNode: <Cpu className="w-3.5 h-3.5" />,
    debug: <Bug className="w-3.5 h-3.5" />,
}

export function NodesInspector() {
    const { setNodes } = useReactFlow();
    const {
        editorState,
        setSheetOpen,
        setSelectedNode,
        isEditorPanelOpen,
        setIsEditorPanelOpen,
        fitNode
    } = useWorkflowEditor()

    const nodes = editorState.graph.nodes

    const handleNodeClick = (node: WorkflowNode) => {
        const rfNode = toReactFlowNode(node);
        setNodes(nds =>  nds.map(nd => nd.id === rfNode.id ? {...nd, selected: true } : nd ))
        fitNode(node);
        setSheetOpen(true);
    }

    return (
        <EditorPanel
            open={isEditorPanelOpen}
            onOpenChange={setIsEditorPanelOpen}
            title="Graph Navigator"
            description={`${nodes.length} nodes active in current workspace`}
            position="Top Left"
            width="w-[300px]"
        >
            <div className="flex flex-col gap-2">
                {nodes.length === 0 ? (
                    <div className="py-10 flex flex-col items-center justify-center border border-dashed border-neutral-800 rounded-lg">
                        <p className="text-[10px] text-neutral-600 uppercase font-bold tracking-widest">
                            No nodes found
                        </p>
                    </div>
                ) : (
                    nodes.map((node) => {
                        const color = getNodeColor(node.type)
                        const status = editorState.runtime?.nodeStatus?.[node.id] ?? "idle"

                        return (
                            <button
                                key={node.id}
                                onClick={() => handleNodeClick(node)}
                                className={cn(
                                    "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                                    "bg-neutral-950/40 border border-neutral-800/50 hover:border-neutral-700 hover:bg-neutral-800/40",
                                    "text-left outline-none focus:ring-1 focus:ring-primary/50"
                                )}
                            >
                                {/* Icon with Type Color */}
                                <div className={cn(
                                    "p-2 rounded-lg bg-neutral-900 border border-neutral-800 transition-colors group-hover:border-neutral-600",
                                    color.text
                                )}>
                                    {ICON_MAP[node.type] || <Cpu className="w-3.5 h-3.5" />}
                                </div>

                                {/* Label & Metadata */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    <span className="text-[11px] font-medium text-neutral-200 truncate">
                                        {node.type || "Untitled Node"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-neutral-500 uppercase tracking-tighter">
                                            {node.type}
                                        </span>
                                        <span className="text-[14px] text-neutral-800 font-light">•</span>
                                        <span className={cn(
                                            "text-[9px] font-bold uppercase",
                                            status === 'success' ? 'text-emerald-500' :
                                                status === 'error' ? 'text-rose-500' :
                                                    status === 'running' ? 'text-blue-500' : 'text-neutral-600'
                                        )}>
                                            {status}
                                        </span>
                                    </div>
                                </div>

                                <ChevronRight className="w-3 h-3 text-neutral-700 group-hover:text-neutral-400 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        )
                    })
                )}
            </div>
        </EditorPanel>
    )
}