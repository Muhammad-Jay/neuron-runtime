"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Zap,
    Cpu,
    Globe,
    Settings2,
    MessageSquare,
    Workflow,
    ArrowRight,
    SearchX
} from "lucide-react";
import { Node } from "reactflow";

import { NODE_TEMPLATES, NodeTemplate } from "@/constants";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NodeTemplateSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectTemplate: (template: NodeTemplate, node?: Node) => void;
}

const CATEGORIES = [
    { id: "all", label: "All Nodes", icon: <Workflow className="w-3 h-3" /> },
    { id: "Logic", label: "Logic", icon: <Cpu className="w-3 h-3" /> },
    { id: "Network", label: "Network", icon: <Globe className="w-3 h-3" /> },
    { id: "AI", label: "Intelligence", icon: <Zap className="w-3 h-3" /> },
    { id: "Communication", label: "Integrations", icon: <MessageSquare className="w-3 h-3" /> },
];

export function NodeTemplateSheet({ open, onOpenChange, onSelectTemplate }: NodeTemplateSheetProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    // Filter Logic
    const filteredTemplates = useMemo(() => {
        return NODE_TEMPLATES.filter((template) => {
            const matchesSearch =
                template.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = activeTab === "all" || template.category === activeTab;

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeTab]);

    return (
        <SheetWrapper
            title="Add Node"
            open={open}
            onOpenChange={onOpenChange}
            className="w-[600px]! p-0! bg-neutral-950/98 backdrop-blur-xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full">
                {/* SEARCH HEADER */}
                <div className="p-6 pb-2 space-y-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="Search nodes (e.g. 'Slack', 'Filter'...)"
                            className="pl-10 bg-neutral-900/50 border-neutral-800 focus-visible:ring-1 focus-visible:ring-blue-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-[550px]">
                        <div id={"hide-scrollbar"} className="w-full overflow-x-scroll pb-2">
                            <TabsList className="inline-flex w-max min-w-full bg-neutral-900/50 border border-neutral-800 p-1 h-auto justify-start items-center gap-1">
                                {CATEGORIES.map((cat) => (
                                    <TabsTrigger
                                        key={cat.id}
                                        value={cat.id}
                                        className={cn(
                                            "whitespace-nowrap flex-shrink-0",
                                            "data-[state=active]:bg-neutral-800 data-[state=active]:text-white",
                                            "text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 gap-2 transition-all",
                                            activeTab === cat.id && "data-[state=active]:bg-primary! data-[state=active]:text-black!"
                                        )}
                                    >
                                        {cat.icon}
                                        {cat.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </Tabs>
                </div>

                {/* TEMPLATES GRID */}
                <ScrollArea className="flex-1 px-6">
                    <div className="py-4 space-y-6">
                        {filteredTemplates.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3 pb-10">
                                {filteredTemplates.map((template) => (
                                    <TemplateCard
                                        key={template.key}
                                        template={template}
                                        onClick={() => {
                                            onSelectTemplate(template);
                                            onOpenChange(false);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                                <div className="p-4 bg-neutral-900 rounded-full">
                                    <SearchX className="w-8 h-8 text-neutral-700" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-400">No nodes found</p>
                                    <p className="text-xs text-neutral-600">Try adjusting your search or category filter</p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </SheetWrapper>
    );
}

function TemplateCard({ template, onClick }: { template: NodeTemplate; onClick: () => void }) {
    // Determine color based on category
    const categoryColors: Record<string, string> = {
        Logic: "text-blue-400 bg-blue-400/10 border-blue-400/20",
        AI: "text-purple-400 bg-purple-400/10 border-purple-400/20",
        Network: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        Communication: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        Utility: "text-neutral-400 bg-neutral-400/10 border-neutral-400/20",
    };

    return (
        <button
            onClick={onClick}
            className="group flex items-start gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-900/20 hover:bg-neutral-800/40 hover:border-neutral-700 transition-all text-left"
        >
            <div className={cn(
                "p-2.5 rounded-lg border shrink-0 transition-transform group-hover:scale-110",
                categoryColors[template.category] || categoryColors.Utility
            )}>
                {/* Dynamically render icons based on type or key */}
                {getIconForType(template.type)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors">
                        {template.label}
                    </span>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter py-0 h-4 border-neutral-800 text-neutral-500">
                        {template.category}
                    </Badge>
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
                    {template.description}
                </p>
            </div>

            <div className="self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                <ArrowRight className="w-4 h-4 text-blue-500" />
            </div>
        </button>
    );
}


function getIconForType(type: string) {
    switch (type) {
        case "llmNode": return <Zap className="w-4 h-4" />;
        case "httpNode": return <Globe className="w-4 h-4" />;
        case "condition":
        case "decisionNode": return <Cpu className="w-4 h-4" />;
        case "transform": return <Settings2 className="w-4 h-4" />;
        default: return <Workflow className="w-4 h-4" />;
    }
}