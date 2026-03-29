import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {cn} from "@/lib/utils";

interface HeadlessDialogDemoProps {
    children?: React.ReactNode;
    triggerButton?: React.ReactNode | string;
    title?: React.ReactNode | string;
    description?: React.ReactNode | string;
    actionButton?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

export const DialogWrapper = (
    {
        children,
        triggerButton = "Create new",
        title,
        description,
        actionButton,
        className,
        contentClassName,
                                   }: HeadlessDialogDemoProps) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className={cn("h-3/4! w-4/5! bg-neutral-800/30 backdrop-blur-md rounded-xl",className)}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <div className={cn("no-scrollbar  max-h-[60vh] w-full overflow-y-auto px-2", contentClassName)}>
                    {children}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    {actionButton}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

