"use client";

import { LucideIcon } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavRoutes({
                              routes,
                          }: {
    routes: {
        name: string
        href: string
        icon: LucideIcon
    }[]
}) {
    const path = usePathname();
    const router = useRouter();
    const { state } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Routes</SidebarGroupLabel>
            <SidebarMenu>
                {routes.map((item) => {
                    const isActive = path === item.href;

                    return (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                onClick={() => router.push(item.href)}
                                // logic: active state uses your neutral-800,
                                // text color shifts to purple-400 when active to match your theme
                                className={cn(
                                    "transition-colors",
                                    isActive && "bg-neutral-800 text-primary-foreground font-medium"
                                )}
                                tooltip={item.name}
                            >
                                {item.icon && (
                                    <item.icon className={cn(
                                        "w-4 h-4",
                                        isActive ? "text-primary-foreground" : "text-neutral-400"
                                    )} />
                                )}

                                {state === "expanded" && (
                                    <span className="text-xs tracking-tight">
                                        {item.name}
                                    </span>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}