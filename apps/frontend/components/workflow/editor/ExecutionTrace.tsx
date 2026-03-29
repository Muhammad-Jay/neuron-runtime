"use client";

import React, { useState } from "react";
import {
    Activity,
    Minimize2,
    Database,
    AlertCircle,
    Terminal,
    Cpu,
    Box,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { JsonRenderer } from "@/components/JsonRenederer";
import { useWorkflowEditor } from "@/hooks/workflow/useWorkflowEditor";
import { cn } from "@/lib/utils";

interface ExecutionTraceProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
    nodeNames?: Record<string, string>;
}

export function ExecutionTrace({ open, onOpenChange, className, nodeNames = {} }: ExecutionTraceProps) {
    const { editorState: { runtime: { nodeOutputs, nodeErrors } } } = useWorkflowEditor();
    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const toggleAll = (ids: string[], open: boolean) => {
        const newState = ids.reduce((acc, id) => ({ ...acc, [id]: open }), {});
        setOpenStates(newState);
    };

    return (
        <SheetWrapper
            className={cn("w-[700px]! h-full! p-0! bg-neutral-950/80 backdrop-blur-xl border-l border-neutral-800", className)}
            open={open}
            onOpenChange={onOpenChange}
        >
            <Tabs defaultValue="outputs" className="flex flex-col h-full">
                {/* Custom Header with Tabs Integration */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-900">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-4">
                            <Activity className="w-4 h-4 text-blue-500" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Trace</h3>
                        </div>

                        <TabsList className="bg-neutral-900 border border-neutral-800 h-8 p-1">
                            <TabsTrigger
                                value="outputs"
                                className="text-[10px] uppercase font-bold px-3 data-[state=active]:bg-neutral-800 data-[state=active]:text-blue-400"
                            >
                                <Database className="w-3 h-3 mr-2" /> Outputs
                            </TabsTrigger>
                            <TabsTrigger
                                value="errors"
                                className="text-[10px] uppercase font-bold px-3 data-[state=active]:bg-neutral-800 data-[state=active]:text-red-400"
                            >
                                <AlertCircle className="w-3 h-3 mr-2" /> Errors
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAll([...Object.keys(nodeOutputs), ...Object.keys(nodeErrors)], false)}
                        className="h-7 px-2 text-[10px] uppercase font-bold text-neutral-500 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                        <Minimize2 className="w-3 h-3 mr-2" />
                        Collapse All
                    </Button>
                </div>

                <div className="flex-1 overflow-hidden px-6">
                    <TabsContent value="outputs" className="h-full m-0 mt-4">
                        <ScrollArea className="h-full pr-4">
                            <TraceList
                                dataMap={nodeOutputs}
                                type="output"
                                nodeNames={nodeNames}
                                openStates={openStates}
                                setOpenStates={setOpenStates}
                                emptyMessage="No outputs generated yet" />
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="errors" className="h-full m-0 mt-4">
                        <ScrollArea className="h-full pr-4">
                            <TraceList
                                dataMap={nodeErrors}
                                type="error"
                                nodeNames={nodeNames}
                                openStates={openStates}
                                setOpenStates={setOpenStates}
                                emptyMessage="No errors found" />
                        </ScrollArea>
                    </TabsContent>
                </div>
            </Tabs>
        </SheetWrapper>
    );
}




// Reusable Trace List Component to easily add more tabs later
const TraceList = ({
                       dataMap,
                       emptyMessage,
                       openStates,
                       setOpenStates,
                       type,
                       nodeNames
}: {
    dataMap: Record<string, any>,
    openStates: Record<string, boolean>,
    setOpenStates: (state: any) => void,
    emptyMessage: string, type: 'output' | 'error',
    nodeNames:  Record<string, string>
}) => {

    const ids = Object.keys(dataMap);
    if (ids.length === 0) return (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-600 border border-dashed border-neutral-800 rounded-lg m-4">
            <p className="text-[10px] uppercase tracking-widest font-bold">{emptyMessage}</p>
        </div>
    );

    return (
        <div className="space-y-3 pb-10">
            {ids.map((id) => {
                const isOpen = openStates[id] ?? false;
                const data = dataMap[id];
                const isError = type === 'error';

                return (
                    <Collapsible
                        key={id}
                        open={isOpen}
                        onOpenChange={(val) => setOpenStates(prev => ({ ...prev, [id]: val }))}
                        className={cn(
                            "group border rounded-lg overflow-hidden transition-all duration-200 bg-neutral-900/40",
                            isError ? "border-red-900/30 hover:border-red-800/50" : "border-neutral-800 hover:border-neutral-700"
                        )}
                    >
                        <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-neutral-800/50 transition-colors text-left">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-1.5 rounded-md bg-neutral-950 border transition-colors",
                                    isOpen
                                        ? (isError ? "text-red-400 border-red-900/50" : "text-blue-400 border-neutral-700")
                                        : "text-neutral-500 border-neutral-800"
                                )}>
                                    {isError ? <AlertCircle className="w-3.5 h-3.5" /> : (
                                        typeof data === 'boolean' ? <Terminal className="w-3.5 h-3.5" /> :
                                            data?.content ? <Cpu className="w-3.5 h-3.5" /> :
                                                <Box className="w-3.5 h-3.5" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-[11px] font-mono text-neutral-300">
                                        {nodeNames[id] || id.split('-')[0]}
                                    </p>
                                    <p className="text-[9px] uppercase font-bold text-neutral-600 tracking-tight">
                                        {isError ? "Execution Failed" : (typeof data === 'object' ? 'Structured Object' : 'Primitive Value')}
                                    </p>
                                </div>
                            </div>
                            {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-neutral-600" /> : <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />}
                        </CollapsibleTrigger>

                        <CollapsibleContent className="border-t border-neutral-800/50">
                            <div className="p-2 bg-black/20">
                                <JsonRenderer
                                    data={data}
                                    title={isError ? "Error Details" : "Raw Output"}
                                    maxHeight="max-h-[300px]"
                                    className="border-none shadow-none"
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                );
            })}
        </div>
    );
};
