"use client";

import { Plus, LayoutGrid, Zap } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyGraphMenuProps {
    onAddNode: () => void;
}

export function EmptyGraphMenu({ onAddNode }: EmptyGraphMenuProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            {/* Subtle Background Glow for context */}
            <div className="absolute w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col items-center gap-6 pt-15 pointer-events-auto">
                {/* The Visual Focal Point */}
                <div className="relative group">
                    {/* Pulsing Border Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/0 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

                    <div className="relative w-48 h-48 rounded-xl border border-dashed border-white/10 bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-black/40">
                        <div className="p-3 rounded-full bg-white/5 border border-white/10 text-white/50 group-hover:text-white group-hover:scale-110 transition-all">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <p className="text-[13px] font-medium text-white/80">Canvas is empty</p>
                            <p className="text-[11px] text-white/40">Start building your automation</p>
                        </div>
                    </div>
                </div>

                {/* The Primary Action */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-10 px-6 rounded-full border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300 text-xs font-semibold gap-2 shadow-2xl"
                        >
                            <Plus className="w-4 h-4" />
                            Build Workflow
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-48 p-2.5 px-1.5 bg-neutral-900 border-neutral-800 text-white rounded-lg shadow-xl"
                        align="center"
                        sideOffset={10}
                    >
                        <DropdownMenuItem
                            className="text-xs py-1.5 rounded-md transition-200 focus:bg-neutral-800 cursor-pointer gap-2"
                            onClick={onAddNode}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            Add First Node
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="text-xs py-2.5 rounded-lg focus:bg-white focus:text-black cursor-pointer gap-2 opacity-50"
                            disabled
                        >
                            <Zap className="w-3.5 h-3.5" />
                            Use Template (Coming Soon)
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}