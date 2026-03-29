"use client";

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area"
import {cn} from "@/lib/utils";

interface ReusableSheetProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}

export function SheetWrapper({
                                  children,
                                  open,
                                  onOpenChange,
                                  title = "",
                                  description = "",
                                  side = "right",
                                  className,
                              }: ReusableSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side={side} className={cn("w-[600px]! h-full! p-0! bg-neutral-950/95 backdrop-blur-xl shadow-2xl  max-h-[97dvh] border-neutral-800/50 overflow-hidden border! m-2.5 mb-3.5 rounded-xl", className)}>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className={'overflow-hidden rounded-md container-full'}>
                    {children}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}