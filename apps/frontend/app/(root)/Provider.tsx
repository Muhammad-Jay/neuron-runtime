"use client";

import {ReactNode} from "react";
import {SidebarProvider} from "@/components/ui/sidebar";
import {WorkflowProvider} from "@/providers/WorkflowProvider";

export const Provider = ({ children }: { children: ReactNode }) => {

    return (
        <>
            <WorkflowProvider>
                <SidebarProvider>
                    {children}
                </SidebarProvider>
            </WorkflowProvider>
        </>
    )
}