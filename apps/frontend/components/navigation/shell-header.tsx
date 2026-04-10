'use client';

import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function ShellHeader() {
    const pathname = usePathname();

    // Logic to turn /dashboard/vault into ["Dashboard", "Vault"]
    const pathSegments = pathname.split('/').filter(Boolean);

    return (
        <header className="sticky top-0 z-40 flex h-15 shrink-0 items-center gap-2 border-b border-neutral-800/50 bg-[#030303]/80 backdrop-blur-md px-4 transition-all">
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-3">
                    <SidebarTrigger className="h-8 w-8 text-neutral-400 hover:bg-neutral-800 hover:text-white" />

                    <Separator
                        orientation="vertical"
                        className="h-4 bg-neutral-800"
                    />

                    <Breadcrumb>
                        <BreadcrumbList>
                            {pathSegments.map((segment, index) => {
                                const isLast = index === pathSegments.length - 1;
                                const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                                const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                                return (
                                    <React.Fragment key={href}>
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage className="text-sm font-bold tracking-wider text-neutral-100">
                                                    {label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink
                                                    href={href}
                                                    className="text-sm font-medium tracking-wider text-neutral-500 transition-colors hover:text-neutral-300"
                                                >
                                                    {label}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && (
                                            <BreadcrumbSeparator className="text-neutral-700">
                                                <span className="text-[10px]">/</span>
                                            </BreadcrumbSeparator>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Right side utility - keep it minimal */}
                <div className="flex items-center gap-4">
                    {/*<div className="hidden h-1.5 w-1.5 rounded-full bg-emerald-500/50 md:block" />*/}
          {/*          <span className="hidden text-[9px] font-bold tracking-[0.2em] text-neutral-600 uppercase md:block">*/}
          {/*  Verified Environment*/}
          {/*</span>*/}
                </div>
            </div>
        </header>
    );
}