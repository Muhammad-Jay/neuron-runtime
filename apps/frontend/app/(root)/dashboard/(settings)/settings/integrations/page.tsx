'use client';

import React, { useState } from 'react';
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
    RefreshCw,
} from 'lucide-react';
import { SUPPORTED_PLATFORMS, IntegrationPlatform } from '@/constants';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SheetWrapper } from '@/components/workflow/editor/SheetWrapper';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MOCK_ACTIVE_CONNECTIONS = [
    {
        id: 'conn_1',
        platformId: 'slack',
        name: "Muhammad's Workspace",
        status: 'active',
        lastUsed: '2 mins ago',
    },
    {
        id: 'conn_2',
        platformId: 'whatsapp',
        name: 'Lazarus Production API',
        status: 'error',
        lastUsed: '1 day ago',
    },
    {
        id: 'conn_3',
        platformId: 'github',
        name: 'Personal GitHub Repo',
        status: 'active',
        lastUsed: '4 hours ago',
    },
];

export default function IntegrationPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlatform, setSelectedPlatform] =
        useState<IntegrationPlatform | null>(null);

    const filteredPlatforms = SUPPORTED_PLATFORMS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen space-y-8 bg-black p-8 text-white">
            <div className="mx-auto max-w-7xl space-y-10">
                {/* HEADER SECTION */}
                <div className="flex flex-col justify-between gap-6">
                    <div className="space-y-1">
              {/*          <div className="mb-2 flex items-center gap-2 text-blue-500">*/}
              {/*              <Zap className="h-4 w-4 fill-current" />*/}
              {/*              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">*/}
              {/*  System Gateway*/}
              {/*</span>*/}
              {/*          </div>*/}
              {/*          <h1 className="text-4xl font-bold tracking-tight">Integrations</h1>*/}
                        <p className="max-w-md text-sm leading-relaxed text-neutral-500">
                            Centralized authentication hub. Connect, monitor, and
                            rotate your third-party credentials.
                        </p>
                    </div>

                    <Tabs defaultValue="discover" className="w-full md:w-auto">
                        <TabsList className="h-12 border border-neutral-800 bg-neutral-900/50 p-1">
                            <TabsTrigger
                                value="discover"
                                className="gap-2 px-6 text-[11px] font-bold tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black"
                            >
                                <LayoutGrid className="h-4 w-4" /> Discover
                            </TabsTrigger>
                            <TabsTrigger
                                value="active"
                                className="gap-2 px-6 text-[11px] font-bold tracking-widest uppercase data-[state=active]:bg-white data-[state=active]:text-black"
                            >
                                <Link2 className="h-4 w-4" /> Managed{' '}
                                <Badge className="ml-1 h-4 border-none bg-blue-500/20 px-1 text-blue-400">
                                    {MOCK_ACTIVE_CONNECTIONS.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        {/* DISCOVER CONTENT (The Grid) */}
                        <TabsContent value="discover" className="mt-12 space-y-8">
                            <div className="relative ml-auto w-full max-w-md">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-600" />
                                <Input
                                    placeholder="Search services..."
                                    className="h-11 rounded-xl border-neutral-800 bg-neutral-900/50 pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {SUPPORTED_PLATFORMS.filter((p) =>
                                    p.name.toLowerCase().includes(searchQuery.toLowerCase())
                                ).map((platform) => (
                                    <PlatformCard
                                        key={platform.id}
                                        platform={platform}
                                        onClick={() => setSelectedPlatform(platform)}
                                    />
                                ))}
                            </div>
                        </TabsContent>

                        {/* MANAGED CONNECTIONS CONTENT */}
                        <TabsContent value="active" className="mt-12">
                            <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/10 backdrop-blur-md">
                                <table className="w-full text-left">
                                    <thead className="border-b border-neutral-800 bg-neutral-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                            Service
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                            Connection Name
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                            Last Activity
                                        </th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-900">
                                    {MOCK_ACTIVE_CONNECTIONS.map((conn) => {
                                        const platform = SUPPORTED_PLATFORMS.find(
                                            (p) => p.id === conn.platformId
                                        );
                                        return (
                                            <tr
                                                key={conn.id}
                                                className="group transition-colors hover:bg-neutral-900/30"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2">
                                                            {platform && (
                                                                <platform.icon
                                                                    style={{ color: platform.color }}
                                                                />
                                                            )}
                                                        </div>
                                                        <span className="text-sm font-bold">
                                {platform?.name}
                              </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-neutral-300">
                                                    {conn.name}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge
                                                        className={cn(
                                                            'border-none px-2 py-0.5 text-[9px] uppercase',
                                                            conn.status === 'active'
                                                                ? 'bg-emerald-500/10 text-emerald-500'
                                                                : 'bg-red-500/10 text-red-500'
                                                        )}
                                                    >
                                                        {conn.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5 font-mono text-xs text-neutral-500">
                                                    {conn.lastUsed}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                                                        >
                                                            <RefreshCw className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-500 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
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

function ConnectionSheet({
                             platform,
                             open,
                             onOpenChange,
                         }: {
    platform: IntegrationPlatform;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <SheetWrapper
            open={open}
            onOpenChange={onOpenChange}
            title={`Connect to ${platform.name}`}
            className="w-[500px]! border-l border-neutral-800 bg-neutral-950/95 backdrop-blur-2xl"
        >
            <div className="flex h-full flex-col space-y-8 p-8 pt-12">
                {/* Visual Identity */}
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900 p-5 shadow-2xl">
                        <platform.icon
                            className="h-12 w-12"
                            style={{ color: platform.color }}
                        />
                        <div className="absolute -right-1 -bottom-1 rounded-full border-4 border-neutral-950 bg-emerald-500 p-1.5">
                            <ShieldCheck className="h-3 w-3 text-white" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Authorize {platform.name}</h2>
                        <p className="mt-1 text-sm text-neutral-500">
                            Lazarus requires access to your {platform.name} account to
                            automate workflows.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {platform.authMethod === 'oauth' ? (
                        /* OAUTH VIEW */
                        <div className="space-y-4">
                            <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    Read and write permissions
                                </div>
                                <div className="flex items-center gap-3 text-xs text-neutral-400">
                                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                    Offline access for background tasks
                                </div>
                            </div>
                            <Button
                                className="h-12 w-full bg-white text-sm font-bold text-black transition-all hover:bg-neutral-200"
                                onClick={() =>
                                    (window.location.href = `/api/auth/${platform.id}`)
                                }
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Connect via {platform.name}
                            </Button>
                        </div>
                    ) : (
                        /* API KEY VIEW */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="ml-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                    Secret API Key
                                </label>
                                <Input
                                    type="password"
                                    placeholder="sk_live_..."
                                    className="h-11 border-neutral-800 bg-neutral-900/50 focus:border-white/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="ml-1 text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                                    Connection Name
                                </label>
                                <Input
                                    placeholder="e.g. Production WhatsApp"
                                    className="h-11 border-neutral-800 bg-neutral-900/50"
                                />
                            </div>
                            <Button className="h-12 w-full bg-white text-sm font-bold text-black hover:bg-neutral-200">
                                Save Connection
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-auto border-t border-neutral-900 pt-8 text-center">
                    <p className="text-[10px] leading-relaxed text-neutral-600">
                        By connecting, you agree to allow Lazarus to manage your data
                        according to our{' '}
                        <span className="cursor-pointer underline">Security Policy</span>.
                        Your secrets are encrypted via AES-256.
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
            className="group relative cursor-pointer overflow-hidden border-neutral-800 bg-neutral-900/20 p-6 backdrop-blur-sm transition-all hover:border-neutral-700"
            onClick={onClick}
        >
            {/* Dynamic Brand Glow - Positioned absolute to the top right */}
            <div
                className="absolute -top-4 -right-4 h-24 w-24 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20"
                style={{ backgroundColor: platform.color }}
            />

            <div className="relative z-10 space-y-4">
                <div className="flex items-start justify-between">
                    {/* Icon Container with subtle border transition */}
                    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3 shadow-inner transition-colors group-hover:border-neutral-600">
                        <platform.icon
                            className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                            style={{ color: platform.color }}
                        />
                    </div>
                    <Badge
                        variant="outline"
                        className="border-neutral-800 text-[9px] font-bold tracking-tighter text-neutral-500 uppercase"
                    >
                        {platform.category}
                    </Badge>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-neutral-200 transition-colors group-hover:text-white">
                        {platform.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                        {platform.description}
                    </p>
                </div>

                {/* Footer logic indicator */}
                <div className="flex items-center justify-between pt-4 text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
          <span className="flex items-center gap-2 transition-colors group-hover:text-neutral-300">
            {platform.authMethod === 'oauth'
                ? 'OAuth 2.0 Flow'
                : 'Secure API Key'}
          </span>
                    <div className="flex -translate-x-2 items-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                        <span className="text-[9px]">Connect</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
