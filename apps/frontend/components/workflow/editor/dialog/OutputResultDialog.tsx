"use client";

import React, { useState } from "react";
import {
    X,
    Database,
    Activity,
    Globe,
    Copy,
    Check,
    Download,
    ExternalLink,
    ShieldCheck,
    Cpu,
    Zap
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OutputRenderer } from "./OutputRenderer";
import { cn } from "@/lib/utils";

interface OutputResultDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    nodeName: string;
    result: string;
    config: {
        format: {
            type: "json" | "markdown" | "text" | "html";
        };
        delivery: {
            statusCode: number;
            mode: string;
        };
    };
}

export function OutputResultDialog({
                                       isOpen,
                                       onOpenChange,
                                       nodeName,
                                       result,
                                       config
                                   }: OutputResultDialogProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "max-w-4xl h-[87dvh] p-0 overflow-hidden justify-start flex flex-col",
                    "bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] rounded-lg"
                )}
            >
                {/* 1. EDITOR-THEMED HEADER */}
                <header className="p-4 border-b border-neutral-800/50 flex flex-col gap-1 bg-neutral-900/40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                <Database className="w-3.5 h-3.5 text-blue-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-sm font-semibold text-neutral-100">
                                    {nodeName || 'INSPECTOR_RESULT'}
                                </DialogTitle>
                                <p className="text-[10px] text-neutral-500 uppercase mt-0.5">
                                    Lazarus Execution Node • 0xAF42
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                        </div>
                    </div>
                </header>


                {/* 3. MAIN CONTENT (Wrapped in Editor Style) */}
                <div className="flex-1 overflow-hidden h-full! relative group p-6 py-1!">
                    <div className="h-full w-full no-scrollbar bg-neutral-800/60 hover:bg-neutral-800/80 transition-200 rounded-md overflow-y-auto relative shadow-inner">
                        {/* The Renderer */}
                        <div className="p-5">
                            <OutputRenderer content={result} format={config.format} />
                        </div>
                    </div>
                </div>

                {/* 4. INDUSTRIAL FOOTER (The "Command" Bar) */}
                <div className="p-4 bg-neutral-900/40 border-t border-neutral-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-600">
                            <Cpu className="w-3 h-3" />
                            <span>NODE_SIG: {result.length}B_SIG</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-neutral-500 hover:text-white">
                            <Download className="w-3.5 h-3.5 mr-2" /> .JSON_EXPORT
                        </Button>
                        <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black tracking-widest px-6 rounded-sm shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                            ANALYZE_ASSET <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}