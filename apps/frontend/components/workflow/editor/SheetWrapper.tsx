"use client";

import React, { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Settings2, ArrowLeft } from "lucide-react";
import { ContextRegistrationSheet } from "../editor/sheet/ContextRegistrationSheet";
import { NodeMeta } from "@/components/workflow/editor/nodes/NodeMeta";
import { ExecutionConfigSettings } from "./sheet/ExecutionConfigSettings";
import { NodeExecutionConfig } from "@neuron/shared";

interface ReusableSheetProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
    nodeId?: string;
    showContextSettings?: boolean;
    nodeMeta?: { label: string; description?: string };
    onMetaUpdate?: (key: string, value: any) => void;
    // New Props for Execution Config
    executionConfig?: NodeExecutionConfig;
    onExecutionConfigUpdate?: (config: NodeExecutionConfig) => void;
}

export function SheetWrapper({
                                 children,
                                 open,
                                 onOpenChange,
                                 title = "",
                                 side = "right",
                                 className,
                                 nodeId,
                                 showContextSettings = true,
                                 nodeMeta,
                                 onMetaUpdate,
                                 executionConfig,
                                 onExecutionConfigUpdate
                             }: ReusableSheetProps) {
    const [view, setView] = useState<"config" | "execution">("config");

    // Reset view when sheet closes
    const handleOpenChange = (open: boolean) => {
        onOpenChange(open);
        if (!open) setTimeout(() => setView("config"), 300);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent
                side={side}
                className={cn(
                    "w-[550px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl shadow-2xl max-h-[97dvh] border-neutral-800/50 overflow-hidden border! m-2.5 mb-3.5 rounded-xl flex flex-col",
                    className
                )}
            >
                {/* DYNAMIC HEADER */}
                <SheetHeader className="px-6 py-4 border-b border-neutral-800/50 bg-neutral-900/20 flex flex-row items-center justify-between space-y-0">
                    <div className="flex flex-col">
                        <SheetTitle className="text-neutral-100 text-sm">
                            {view === "config" ? title : "Execution Settings"}
                        </SheetTitle>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                            {view === "config" ? "Node Configuration" : "Runtime Policy"}
                        </p>
                    </div>

                    {/* VIEW TOGGLE BUTTON */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setView(view === "config" ? "execution" : "config")}
                        className="h-8 gap-2 mr-6 border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 text-neutral-300"
                    >
                        {view === "config" ? (
                            <>
                                <Settings2 className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Execution Settings</span>
                            </>
                        ) : (
                            <>
                                <ArrowLeft className="w-3.5 h-3.5" />
                                <span className="text-[11px]">Back to Config</span>
                            </>
                        )}
                    </Button>
                </SheetHeader>

                <ScrollArea className="h-[80dvh] flex-1">
                    <div className="space-y-6 px-6 py-6">
                        {view === "config" ? (
                            <>
                                {onMetaUpdate && (
                                    <NodeMeta
                                        label={nodeMeta?.label ?? ""}
                                        description={nodeMeta?.description ?? ""}
                                        onUpdate={onMetaUpdate}
                                    />
                                )}
                                <div className="space-y-5">{children}</div>
                                {showContextSettings && nodeId && (
                                    <div className="pt-6 border-t border-neutral-800/50">
                                        <p className="text-[10px] font-bold uppercase text-neutral-600 tracking-[0.2em] mb-4">
                                            Neuron Engine Core
                                        </p>
                                        <ContextRegistrationSheet nodeId={nodeId} />
                                    </div>
                                )}
                            </>
                        ) : (
                            <ExecutionConfigSettings
                                config={executionConfig}
                                onUpdate={onExecutionConfigUpdate}
                            />
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}