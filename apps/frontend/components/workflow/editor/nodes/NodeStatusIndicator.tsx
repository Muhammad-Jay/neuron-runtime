"use client";

import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import {NodeExecutionStatus} from "../../../../../shared/src/types/node.types";

interface NodeStatusIndicatorProps {
    status?: NodeExecutionStatus;
    size?: number;
}

export function NodeStatusIndicator({
                                        status = "idle",
                                        size = 14,
                                    }: NodeStatusIndicatorProps) {
    switch (status) {
        case "running":
            return (
                <Loader2
                    className="animate-spin text-white"
                    size={size}
                />
            );

        case "success":
            return (
                <CheckCircle2
                    className="text-emerald-500"
                    size={size}
                />
            );

        case "error":
            return (
                <AlertCircle
                    className="text-red-500"
                    size={size}
                />
            );

        case "idle":
        default:
            return (
                <div
                    className="rounded-full bg-muted"
                    style={{ width: size, height: size }}
                />
            );
    }
}