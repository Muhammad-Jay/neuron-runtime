"use client";

import { ReactNode } from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import { cn } from "@/lib/utils";

interface ContextMenuWrapperProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
    open?: boolean;
}

export const ContextMenuWrapper = ({
                                       trigger,
                                       children,
                                       className,
                                   }: ContextMenuWrapperProps) => {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{trigger}</ContextMenuTrigger>
            <ContextMenuContent
                className={cn(
                    "nopan nodrag bg-neutral-900 text-neutral-100 shadow-md border border-neutral-700 rounded-md p-1 text-xs",
                    className
                )}
            >
                {children}
            </ContextMenuContent>
        </ContextMenu>
    );
};