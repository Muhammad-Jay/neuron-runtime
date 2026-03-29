"use client";

import React from "react";
import {
    Play,
    MoreVertical,
    Trash2,
    ExternalLink,
    Activity,
    Clock,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const WorkflowRow = ({ workflow, onOpen, onDelete }: any) => {
    return (
        <div
            onClick={onOpen}
            className="group relative flex items-center justify-between px-6 py-4 border-b border-neutral-800/40 cursor-pointer transition-all duration-200 hover:bg-white/[0.03]"
        >
            {/* 1. HOVER INDICATOR (The White Bar) */}
            <div className="absolute left-0 top-0 h-full w-[2px] bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

            {/* 2. PRIMARY INFO: NAME & STATUS */}
            <div className="flex items-center gap-6 min-w-[300px]">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                        <Zap className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-semibold text-neutral-200 group-hover:text-white transition-colors">
                            {workflow.name}
                        </h3>
                        <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-tighter mt-0.5">
                            ID: {workflow.id?.slice(0, 8) || '0x_internal'}
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. TECHNICAL METRICS (Scannable Data) */}
            <div className="hidden lg:flex items-center gap-12 flex-1 px-12">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Last Run</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[11px] text-neutral-400 font-mono">Success</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">Created</span>
                    <div className="flex items-center gap-2 text-neutral-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[11px] font-mono">{new Date(workflow.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* 4. CONTEXTUAL ACTIONS (Hidden until hover) */}
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-[11px] font-bold text-white hover:bg-white hover:text-black transition-all rounded-none"
                >
                    <Play className="w-3 h-3 fill-current" /> RUN_ENGINE
                </Button>

                <div className="h-4 w-[1px] bg-neutral-800 mx-1" />

                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};