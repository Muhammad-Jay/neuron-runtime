"use client";

import React from "react";
import { Panel, PanelPosition } from "reactflow";
import { cn } from "@/lib/utils";

interface PanelWrapperProps {
    children: React.ReactNode;
    position?: PanelPosition;
    className?: string;
    /** Optional title for the panel header */
    title?: string;
    /** Adds a specific width to the panel */
    width?: string;
}

export function PanelWrapper({
                                 children,
                                 position = "top-right",
                                 className,
                                 title,
                                 width = "w-64",
                             }: PanelWrapperProps) {
    return (
        <Panel
            position={position}
            className={cn("m-2", className)}
        >
            <div
                className={cn(
                    "flex flex-col rounded-md border border-neutral-800/50",
                    "bg-neutral-900/50 backdrop-blur-md shadow-2xl",
                    "transition-all duration-200",
                    width
                )}
            >
                {/* Optional Header Section */}
                {title && (
                    <div className="px-4 py-2 border-b border-neutral-800/50 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {title}
            </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    </div>
                )}

                {/* Content Area */}
                <div className="p-2 text-neutral-200 text-xs">
                    {children}
                </div>
            </div>
        </Panel>
    );
}