"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    ExternalLink,
    ShieldCheck,
    ArrowRight,
    Zap,
    LayoutGrid,
    Link2,
    Trash2,
    RefreshCw
} from "lucide-react";
import { SUPPORTED_PLATFORMS, IntegrationPlatform } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SheetWrapper } from "@/components/workflow/editor/SheetWrapper";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

const MOCK_ACTIVE_CONNECTIONS = [
    { id: "conn_1", platformId: "slack", name: "Muhammad's Workspace", status: "active", lastUsed: "2 mins ago" },
    { id: "conn_2", platformId: "whatsapp", name: "Lazarus Production API", status: "error", lastUsed: "1 day ago" },
    { id: "conn_3", platformId: "github", name: "Personal GitHub Repo", status: "active", lastUsed: "4 hours ago" },
];

export default function IntegrationPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState<IntegrationPlatform | null>(null);

    const filteredPlatforms = SUPPORTED_PLATFORMS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-black text-white p-8 space-y-8">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* HEADER SECTION */}
                <div className="flex flex-col  justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-blue-500 mb-2">
                            <Zap className="w-4 h-4 fill-current" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.2em]">System Gateway</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Integrations</h1>
                        <p className="text-neutral-500 text-sm max-w-md leading-relaxed">
                            Centralized authentication hub for Lazarus. Connect, monitor, and rotate your third-party credentials.
                        </p>
                    </div>

                    <Tabs defaultValue="discover" className="w-full md:w-auto">
                        <TabsList className="bg-neutral-900/50 border border-neutral-800 p-1 h-12">
                            <TabsTrigger value="discover" className="px-6 gap-2 text-[11px] uppercase font-bold tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">
                                <LayoutGrid className="w-4 h-4" /> Discover
                            </TabsTrigger>
                            <TabsTrigger value="active" className="px-6 gap-2 text-[11px] uppercase font-bold tracking-widest data-[state=active]:bg-white data-[state=active]:text-black">
                                <Link2 className="w-4 h-4" /> Managed <Badge className="ml-1 h-4 px-1 bg-blue-500/20 text-blue-400 border-none">{MOCK_ACTIVE_CONNECTIONS.length}</Badge>
                            </TabsTrigger>
                        </TabsList>

                        {/* DISCOVER CONTENT (The Grid) */}
                        <TabsContent value="discover" className="mt-12 space-y-8">
                            <div className="relative w-full max-w-md ml-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                <Input
                                    placeholder="Search services..."
                                    className="pl-10 bg-neutral-900/50 border-neutral-800 rounded-xl h-11"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {SUPPORTED_PLATFORMS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((platform) => (
                                    <PlatformCard key={platform.id} platform={platform} onClick={() => setSelectedPlatform(platform)} />
                                ))}
                            </div>
                        </TabsContent>

                        {/* MANAGED CONNECTIONS CONTENT */}
                        <TabsContent value="active" className="mt-12">
                            <div className="bg-neutral-900/10 border border-neutral-800 rounded-2xl overflow-hidden backdrop-blur-md">
                                <table className="w-full text-left">
                                    <thead className="bg-neutral-900/50 border-b border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">Service</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">Connection Name</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">Status</th>
                                        <th className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500">Last Activity</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-900">
                                    {MOCK_ACTIVE_CONNECTIONS.map((conn) => {
                                        const platform = SUPPORTED_PLATFORMS.find(p => p.id === conn.platformId);
                                        return (
                                            <tr key={conn.id} className="group hover:bg-neutral-900/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-neutral-900 rounded-lg border border-neutral-800">
                                                            {platform && <platform.icon className="w-4 h-4" style={{ color: platform.color }} />}
                                                        </div>
                                                        <span className="text-sm font-bold">{platform?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-neutral-300 font-medium">{conn.name}</td>
                                                <td className="px-6 py-5">
                                                    <Badge className={cn(
                                                        "text-[9px] uppercase px-2 py-0.5 border-none",
                                                        conn.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                                    )}>
                                                        {conn.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5 text-xs text-neutral-500 font-mono">{conn.lastUsed}</td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-white hover:bg-neutral-800"><RefreshCw className="w-3.5 h-3.5" /></Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* CONFIGURATION SHEET */}
            {selectedPlatform && (
                <ConnectionSheet
                    platform={selectedPlatform}
                    open={!!selectedPlatform}
                    onOpenChange={(open) => !open && setSelectedPlatform(null)}
                />
            )}
        </div>
    );
}


function ConnectionSheet({ platform, open, onOpenChange }: { platform: IntegrationPlatform, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpenChange}
            title={`Connect to ${platform.name}`}
            className="w-[500px]! bg-neutral-950/95 backdrop-blur-2xl border-l border-neutral-800"
        >
            <div className="flex flex-col h-full p-8 pt-12 space-y-8">
                {/* Visual Identity */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-5 bg-neutral-900 rounded-3xl border border-neutral-800 shadow-2xl relative">
                        <platform.icon className="w-12 h-12" style={{ color: platform.color }} />
                        <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-4 border-neutral-950">
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Authorize {platform.name}</h2>
                        <p className="text-sm text-neutral-500 mt-1">Lazarus requires access to your {platform.name} account to automate workflows.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {platform.authMethod === "oauth" ? (
                        /* OAUTH VIEW */
                        <div className="space-y-4">
                            <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3">
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Read and write permissions
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Offline access for background tasks
                                </div>
                            </div>
                            <Button
                                className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-bold text-sm transition-all"
                                onClick={() => window.location.href = `/api/auth/${platform.id}`}
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Connect via {platform.name}
                            </Button>
                        </div>
                    ) : (
                        /* API KEY VIEW */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Secret API Key</label>
                                <Input
                                    type="password"
                                    placeholder="sk_live_..."
                                    className="bg-neutral-900/50 border-neutral-800 h-11 focus:border-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-1">Connection Name</label>
                                <Input
                                    placeholder="e.g. Production WhatsApp"
                                    className="bg-neutral-900/50 border-neutral-800 h-11"
                                />
                            </div>
                            <Button className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-bold text-sm">
                                Save Connection
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-auto pt-8 border-t border-neutral-900 text-center">
                    <p className="text-[10px] text-neutral-600 leading-relaxed">
                        By connecting, you agree to allow Lazarus to manage your data according to our <span className="underline cursor-pointer">Security Policy</span>. Your secrets are encrypted via AES-256.
                    </p>
                </div>
            </div>
        </SheetWrapper>
    );
}

interface PlatformCardProps {
    platform: IntegrationPlatform;
    onClick: () => void;
}

export function PlatformCard({ platform, onClick }: PlatformCardProps) {
    return (
        <Card
            className="group relative bg-neutral-900/20 border-neutral-800 hover:border-neutral-700 transition-all p-6 cursor-pointer overflow-hidden backdrop-blur-sm"
            onClick={onClick}
        >
            {/* Dynamic Brand Glow - Positioned absolute to the top right */}
            <div
                className="absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: platform.color }}
            />

            <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                    {/* Icon Container with subtle border transition */}
                    <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 group-hover:border-neutral-600 transition-colors shadow-inner">
                        <platform.icon
                            className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
                            style={{ color: platform.color }}
                        />
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase border-neutral-800 text-neutral-500 font-bold tracking-tighter">
                        {platform.category}
                    </Badge>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-neutral-200 group-hover:text-white transition-colors">
                        {platform.name}
                    </h3>
                    <p className="text-sm text-neutral-500 leading-relaxed mt-1 line-clamp-2">
                        {platform.description}
                    </p>
                </div>

                {/* Footer logic indicator */}
                <div className="pt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                    <span className="flex items-center gap-2 group-hover:text-neutral-300 transition-colors">
                        {platform.authMethod === 'oauth' ? 'OAuth 2.0 Flow' : 'Secure API Key'}
                    </span>
                    <div className="flex items-center gap-2 text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <span className="text-[9px]">Connect</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </Card>
    );
}