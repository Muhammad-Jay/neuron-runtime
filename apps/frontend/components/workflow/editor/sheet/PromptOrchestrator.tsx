"use client";

import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield, MessageSquare, Maximize2 } from "lucide-react";
import { TemplateTextarea } from "@/components/workflow/editor/TemplateTextarea";

interface PromptOrchestratorProps {
    systemPrompt: string;
    userPrompt: string;
    variables: any[];
    onUpdate: (key: string, value: string) => void;
    modelName?: string;
}

export const PromptOrchestrator = ({
                                       systemPrompt,
                                       userPrompt,
                                       variables,
                                       onUpdate,
                                       modelName = "AI Model",
                                   }: PromptOrchestratorProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="w-full group flex items-center justify-between p-5 bg-white/[0.03] border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-all active:scale-[0.99]">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-white/5 rounded-xl text-neutral-400 group-hover:text-white transition-colors">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-[14px] font-semibold text-white tracking-tight">
                                Prompt Orchestrator
                            </p>
                            <p className="text-[12px] text-neutral-500 mt-0.5">
                                Configure behavior and instructions
                            </p>
                        </div>
                    </div>
                    <Maximize2 className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                </button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl h-[83vh] p-0 bg-neutral-950 backdrop-blur-xl border-neutral-800 flex flex-col overflow-hidden shadow-2xl">
                {/* STICKY HEADER */}
                <DialogHeader className="px-8 py-6 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-white tracking-tight">
                                AI Orchestration
                            </DialogTitle>
                            <p className="text-xs text-neutral-500">
                                Refine the logic for {modelName}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* SCROLLABLE EDITOR AREA */}
                <ScrollArea className="flex-1 max-h-[50dvh]">
                    <div className="p-8 py-1!">
                        <Accordion
                            type="multiple"
                            defaultValue={["system", "prompt"]}
                            className="space-y-4"
                        >
                            {/* SYSTEM PERSONA SECTION */}
                            <AccordionItem
                                value="system"
                                className="border border-neutral-800 rounded-xl bg-white/[0.01] px-2 overflow-hidden"
                            >
                                <AccordionTrigger className="px-4 py-4 hover:no-underline group">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                      System Persona
                    </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-4">
                                    <TemplateTextarea
                                        value={systemPrompt}
                                        onChange={(val) => onUpdate("systemPrompt", val)}
                                        variables={variables}
                                        className="bg-transparent border-neutral-800 min-h-[160px] text-[14px] leading-relaxed text-neutral-300 focus:border-white/30 transition-all rounded-lg p-4 resize-none"
                                        placeholder="Describe how the AI should act..."
                                    />
                                </AccordionContent>
                            </AccordionItem>

                            {/* USER PROMPT SECTION */}
                            <AccordionItem
                                value="prompt"
                                className="border border-neutral-800 rounded-xl bg-white/[0.01] px-2 overflow-hidden"
                            >
                                <AccordionTrigger className="px-4 py-4 hover:no-underline group">
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                                        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">
                                            Prompt
                    </span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-4">
                                    <TemplateTextarea
                                        value={userPrompt}
                                        onChange={(val) => onUpdate("userPrompt", val)}
                                        variables={variables}
                                        className="bg-transparent border-neutral-800 min-h-[280px] text-[14px] leading-relaxed text-neutral-300 focus:border-white/30 transition-all rounded-lg p-4 resize-none"
                                        placeholder="Enter instructions and use {{variables}}..."
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </ScrollArea>

                {/* STICKY FOOTER */}
                <div className="p-6 px-8 border-t border-neutral-900 bg-neutral-950/80 backdrop-blur-md flex items-center justify-between">
                    <div className="text-[11px] text-neutral-500 font-medium">
                        CHANGES ARE SAVED AUTOMATICALLY
                    </div>
                    <div className="flex items-center gap-3">
                        <DialogTrigger asChild>
                            <Button className="bg-white text-black hover:bg-neutral-200 px-10 font-bold rounded-lg h-10 transition-colors">
                                Close
                            </Button>
                        </DialogTrigger>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};