"use client";

import React from "react";
import { Zap, Cpu, MessageSquareCode } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function EditorLoader() {
    return (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[999] flex flex-col items-center justify-center p-6 space-y-12">

            {/* --- CORE VISUALIZATION: Node Assembly --- */}
            <div className="relative w-80 h-52 flex items-center justify-center">

                {/* Connecting Lines (Background) */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 320 208">
                    {/* Path 1: Trigger to LLM */}
                    <path d="M 160 30 C 160 70, 70 70, 70 110" stroke="#3b82f6" strokeWidth="1.5" fill="none" className="animate-pulse" strokeDasharray="6 6" />
                    {/* Path 2: LLM to Slack */}
                    <path d="M 70 110 C 70 150, 250 150, 250 110" stroke="#a855f7" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="[animation-delay:1s] animate-pulse" />
                    {/* Path 3: Slack to End */}
                    <path d="M 250 110 C 250 150, 160 150, 160 190" stroke="#eab308" strokeWidth="1.5" fill="none" strokeDasharray="6 6" className="[animation-delay:2s] animate-pulse" />
                </svg>

                {/* 1. Trigger Node (Top) */}
                <div className="absolute top-0 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/30">
                        <Zap className="w-5 h-5 text-blue-500 animate-pulse" />
                    </div>
                </div>

                {/* 2. LLM Node (Mid-Left) */}
                <div className="absolute left-0 flex flex-col items-center gap-2 [animation-delay:0.8s] animate-in fade-in slide-in-from-left-4 duration-1000">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 relative">
                        <Cpu className="w-5 h-5 text-purple-500" />
                        {/* Blinking status dot */}
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500/20 border border-purple-500 animate-ping" />
                    </div>
                </div>

                {/* 3. Slack Node (Mid-Right) */}
                <div className="absolute right-0 flex flex-col items-center gap-2 [animation-delay:1.5s] animate-in fade-in slide-in-from-right-4 duration-1000">
                    <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 relative">
                        <MessageSquareCode className="w-5 h-5 text-amber-500" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500 [animation-delay:0.3s] animate-ping" />
                    </div>
                </div>

                {/* 4. End Node (Bottom) */}
                <div className="absolute bottom-0 flex flex-col items-center gap-2 [animation-delay:2.2s] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="w-10 h-10 bg-neutral-900 rounded-full border border-neutral-800 flex items-center justify-center">
                        <div className="w-3.5 h-3.5 rounded-full bg-neutral-700 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* --- TEXT & BRANDING --- */}
            <div className="text-center space-y-4 max-w-sm">
                <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-extrabold tracking-tighter text-white">Jaguar</span>
                    <Badge variant="outline" className="h-6 text-[10px] border-neutral-800 text-neutral-500 font-mono tracking-widest uppercase px-2">
                        Workflow IDE
                    </Badge>
                </div>

                <div className="relative pt-4">
                    {/* Subtle status text that cycles through phases */}
                    <p className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest animate-pulse h-4">
                        <StatusCycle />
                    </p>
                    {/* Micro-loader bar below the text */}
                    <div className="w-16 h-0.5 bg-neutral-900 rounded-full mt-3 mx-auto overflow-hidden relative">
                        <div className="absolute inset-y-0 left-0 bg-blue-500/40 rounded-full w-full -translate-x-full animate-indeterminate-progress" />
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Helper component to cycle through loading messages (optional polish)
 */
function StatusCycle() {
    const [index, setIndex] = React.useState(0);
    const messages = [
        "Initializing Runtime...",
        "Assembling Graph Structure...",
        "Resolving Dependencies...",
        "Connecting System APIs...",
        "Finalizing Editor Interface..."
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 2200); // Align with node assembly speed
        return () => clearInterval(interval);
    }, []);

    return messages[index];
}

/**
 * A simple Badge component if you don't have it extracted
 */
function Badge({ children, className, variant }: any) {
    return (
        <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 font-medium", className)}>
            {children}
        </span>
    );
}