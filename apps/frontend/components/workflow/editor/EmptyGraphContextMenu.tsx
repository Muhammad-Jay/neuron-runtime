"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {Card} from "@/components/ui/card";

interface EmptyGraphMenuProps {
    onAddNode: () => void;
}

export function EmptyGraphMenu({ onAddNode }: EmptyGraphMenuProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        size="sm"
                        className="pointer-events-auto container-fit bg-transparent text-xs px-3 py-1 h-auto"
                        variant="ghost"
                    >
                        <Card className={'w-[200px] h-[200px] rounded-lg bg-muted/50 canter!'}>
                            <h2 className={'text-xs! self-center'}> Open Menu</h2>
                        </Card>
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40 text-xs"  align="end">
                    <DropdownMenuItem
                        className="text-xs"
                        onClick={onAddNode}
                    >
                        Add Node
                    </DropdownMenuItem>

                    {/* Add more options here later */}
                    {/* <DropdownMenuItem className="text-xs">Import Template</DropdownMenuItem> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}