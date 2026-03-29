"use client";

import React from "react";
import {
    Calendar,
    ChevronRight,
    Trash2,
    Layers,
    Zap,
    Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkflow } from "@/hooks/workflow/useWorkflow";
import { WorkflowType } from "../../../shared/src/types/workflow.types";
import { cn } from "@/lib/utils";

export const WorkflowCard = ({
                                 workflow,
                                 clickAction,
                                 deleteAction,
                             }: {
    workflow: WorkflowType;
    clickAction: (id: string) => Promise<void>;
    deleteAction: (id: string) => Promise<void>;
}) => {
    const { handleClick, handleDelete, isDeleting } = useWorkflow({
        workflow,
        clickAction,
        deleteAction,
    });

    return (
        <Card
            onClick={handleClick}
            className={cn(
                "group relative w-full h-50 overflow-hidden cursor-pointer",
                "bg-neutral-900/50 backdrop-blur-sm border-[0.5px] border-white/5 rounded-2xl transition-all duration-500",
                "hover:border-primary hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]"
            )}
        >

            <div className="relative h-full p-3 py-1! flex flex-col justify-between z-10">
                {/* 2. TOP SECTION: ICON & NAME */}
                <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className="p-3 bg-neutral-800/50 border border-white/5 rounded-xl transition-all duration-500">
                            <Zap className="w-5 h-5 text-neutral-500 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold text-neutral-200 tracking-tight group-hover:text-white transition-colors">
                                {workflow.name || "Untitled_Process"}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-500 tracking-widest">
                                <Layers className="w-3 h-3" />
                                <span>{workflow.description}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. CENTER METRICS (Subtle) */}
                <div className="flex items-center gap-4 py-2">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-neutral-600 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] text-neutral-500">{new Date(workflow.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 border-l border-white/5 pl-4">
                        <Clock className="w-3 h-3 text-neutral-600" />
                        <span className="text-[10px] text-neutral-500">Status: Active</span>
                    </div>
                </div>

                {/* 4. FOOTER ACTIONS */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 group-hover:border-blue-500/10 transition-colors">
                    <div className="flex items-center gap-1 text-[10px] font-black text-neutral-600 group-hover:text-primary uppercase tracking-tighter">
                        Secure_Engine
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="h-8 w-8 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-500 text-neutral-600 transition-all"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                            onClick={handleClick}
                            className="h-8 px-4 bg-white/5 hover:text-black hover:bg-primary border border-white/10 hover:border-primary rounded-lg text-[11px] font-bold text-neutral-300 transition-all duration-300 group/btn"
                        >
                            open <ChevronRight className="w-3 h-3 ml-1.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};