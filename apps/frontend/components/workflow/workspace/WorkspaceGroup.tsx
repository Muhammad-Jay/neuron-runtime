'use client';

import { cn } from '@/lib/utils';
import { Folder } from 'lucide-react';
import {useDroppable} from "@dnd-kit/core";

interface WorkspaceGroupProps {
    id: string;
    title: string;
    count: number;
    children: React.ReactNode;
}

export const WorkspaceGroup = ({ id, title, count, children }: WorkspaceGroupProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="group flex flex-col gap-3">
            {/* The Container Case */}
            <div
                ref={setNodeRef}
                className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden transition-all duration-300",
                    "rounded-2xl bg-muted/40 border border-white/[0.03]",
                    "hover:bg-muted/60 hover:border-white/10 hover:shadow-2xl hover:shadow-black/20",
                    isOver && "bg-muted/80 border-white/40 scale-[1.02]"
                )}>
                {/* Visual Glassmorphism highlight */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                {children}

                {/* Subtle Count Badge Top Right */}
                <div className="absolute top-4 right-4 rounded-full bg-neutral-950/50 px-2 py-1 text-[9px] font-bold text-neutral-400 backdrop-blur-md border border-white/5">
                    {count} ITEMS
                </div>
            </div>

            {/* Label at the Bottom (Outside the BG) */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <Folder className="h-3.5 w-3.5 text-neutral-600 group-hover:text-white transition-colors" />
                    <span className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors">
                        {title}
                    </span>
                </div>
                <div className="h-1 w-1 rounded-full bg-neutral-800 group-hover:bg-white transition-colors" />
            </div>
        </div>
    );
};