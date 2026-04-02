import React from "react";
import {
    Braces,
    Cpu,
    ExternalLink,
    Info,
    Maximize2,
    CheckCircle2,
    Circle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
} from "@/components/ui/dialog";
import CodeEditor from "@/components/workflow/editor/CodeEditor";
import { cn } from "@/lib/utils";

interface SchemaEditorProps {
    value: string;
    onChange: (val: string) => void;
}

export function SchemaDialog({ value, onChange }: SchemaEditorProps) {
    const hasValue = typeof value === 'string' && value?.trim()?.length > 0;

    const defaultTemplate = `{
  name: z.string().describe("User's full name"),
  age: z.number().positive(),
  interests: z.array(z.string())
}`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className={cn(
                        "w-full group flex items-center justify-between p-5 transition-all active:scale-[0.99] border rounded-2xl",
                        hasValue
                            ? "bg-emerald-500/[0.03] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                            : "bg-white/[0.03] border-neutral-800 hover:border-neutral-700"
                    )}
                >
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "p-2.5 rounded-xl transition-colors",
                            hasValue ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-neutral-400 group-hover:text-white"
                        )}>
                            <Braces className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2">
                                <p className="text-[14px] font-semibold text-white tracking-tight">
                                    Output Schema
                                </p>
                                {hasValue && (
                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Updated</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[12px] text-neutral-500 mt-0.5">
                                {hasValue ? "Structured JSON output configured" : "Define AI output structure"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className={cn(
                                "text-[10px] font-mono font-medium uppercase tracking-widest",
                                hasValue ? "text-emerald-500" : "text-neutral-600"
                            )}>
                                {hasValue ? "Configured" : "Empty"}
                            </p>
                        </div>
                        <Maximize2 className={cn(
                            "w-4 h-4 transition-colors",
                            hasValue ? "text-emerald-500" : "text-neutral-600 group-hover:text-white"
                        )} />
                    </div>
                </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg w-2xl  bg-neutral-950 backdrop-blur-xl border-neutral-800 rounded-xl  p-0 overflow-hidden shadow-2xl">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                            <Cpu className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-semibold text-white tracking-tight">
                               Output Schema
                            </DialogTitle>
                            <DialogDescription className="text-xs text-neutral-500">
                                Define the exact JSON structure the AI must return using Zod-like syntax.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6 pt-2 space-y-3">
                    <div className="rounded-xl border border-neutral-800 overflow-hidden bg-black shadow-2xl">
                        {/* Code Editor */}
                        <CodeEditor
                            value={value || ""}
                            onChange={(val: string) => onChange("outputSchema", val)}
                            height="290px"
                            className="border-0 max-w-full!"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
                        <div className="flex items-center gap-3">
                            <Info className="w-4 h-4 text-emerald-500" />
                            <span className="text-[11px] text-neutral-400 leading-normal max-w-[420px]">
                                Constrain the AI using <code className="text-white">z.string()</code>, <code className="text-white">z.number()</code>, and <code className="text-white">.describe()</code>.
                            </span>
                        </div>
                        <Button
                            size="sm"
                            variant="default"
                            className="text-xs py-5! h-8 p-3 font-semibold transition-colors"
                            onClick={() => onChange("outputSchema", defaultTemplate)}
                        >
                            Load Boilerplate
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}