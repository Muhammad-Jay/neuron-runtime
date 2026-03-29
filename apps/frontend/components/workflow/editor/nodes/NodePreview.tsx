"use client";

import React, {useState} from "react";
import {Eye, Maximize2, Terminal} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {JsonRenderer} from "@/components/JsonRenederer";
import {cn} from "@/lib/utils";
import {OutputResultDialog} from "@/components/workflow/editor/dialog/OutputResultDialog";

interface NodePreviewProps {
    nodeId: string;
    output: any;
    className?: string;
    status: "idle" | "running" | "success" | "error";
    nodeType?: string;
    nodeData?: any;
    config: any;
}

export function NodePreview({ nodeId, output, config, status, className, nodeType, nodeData }: NodePreviewProps) {
    const [isFullViewOpen, setIsFullViewOpen] = useState(false);

    if (!output) return null;

    const isOutputNode = nodeType === "outputNode";

    return (
        <div className={cn("z-50 container-fit", className)}>
            <div className="flex items-center gap-1 bg-neutral-900/80 border border-neutral-800 p-1 rounded-md shadow-2xl backdrop-blur-md">

                {/* 1. QUICK PREVIEW (Existing) */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="xs"
                            variant="ghost"
                            className="h-6 w-6 p-0 rounded-full hover:bg-blue-500/20 hover:text-blue-400 group"
                        >
                            <Eye className="w-3 h-3 transition-transform group-hover:scale-110" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        align="start"
                        className="p-0 border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden min-w-[300px]"
                    >
                        <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-neutral-800">
                            <span className="text-[10px] uppercase font-bold tracking-tighter text-neutral-500 flex items-center gap-2">
                                <Terminal className="w-3 h-3" /> Quick Preview
                            </span>
                            <p className="text-[9px] font-mono text-neutral-600">ID: {nodeId.split('-')[0]}</p>
                        </div>
                        <div className="p-2 no-scrollbar">
                            <JsonRenderer
                                data={output}
                                maxHeight="max-h-[320px]"
                                className="border-none w-[500px]! bg-transparent"
                            />
                        </div>
                    </PopoverContent>
                </Popover>

                {/* 2. FULL DIALOG TRIGGER (Output Node Only) */}
                {isOutputNode && (
                    <>
                        <Button
                            onClick={() => setIsFullViewOpen(true)}
                            size="xs"
                            variant="ghost"
                            className="h-6 w-6 p-0 rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 group"
                        >
                            <Maximize2 className="w-3 h-3 transition-transform group-hover:scale-110" />
                        </Button>

                        <OutputResultDialog
                            isOpen={isFullViewOpen}
                            onOpenChange={setIsFullViewOpen}
                            nodeName={nodeData?.label || "Final Data Output"}
                            result={typeof output === 'object' ? JSON.stringify(output) : output}
                            config={config}
                        />
                    </>
                )}

                {/* Status Divider & Text */}
                <div className="h-4 w-[1px] bg-neutral-800 mx-1" />
                <span className="text-[9px] font-mono pr-2 pl-1 text-neutral-400 max-w-[120px] truncate">
                    {typeof output === 'string'
                        ? output.substring(0, 15)
                        : isOutputNode ? 'Formatted Output' : 'Object Resolved'}
                </span>
            </div>
        </div>
    );
}