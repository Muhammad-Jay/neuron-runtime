"use client";

import React from "react";
import {NodeProps, Position} from "reactflow";
import { NodeHandle } from "./NodeHandle";
import { cn } from "@/lib/utils";

interface DecisionNodeHandlesRendererProps {
    node: NodeProps
}

export function DecisionNodeHandlesRenderer({ node }: DecisionNodeHandlesRendererProps) {
    // Defensive check: Ensure config exists before destructuring
    if (!node) return null;

    console.log("Node from decision NOde: ", node);
    const { data: { rules, includeDefault } } = node;

    // We only render source handles if there are rules
    if (!rules || !Array.isArray(rules) || rules.length === 0) return null;

    return (
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around py-4 pointer-events-none">
            {rules.map((rule: any, index: number) => {
                return (
                    <div
                        key={rule.id || index}
                        className="relative flex items-center justify-end group pointer-events-auto"
                        style={{ height: `${100 / rules.length}%` }}
                    >
                        <NodeHandle
                            node={node}
                            type="source"
                            position={Position.Right}
                            id={rule.id}
                            className={cn(
                                "-right-[35px]! bg-neutral-900 hover:bg-blue-500 hover:border-blue-400 transition-all shadow-sm",
                            )}
                        />

                        {/* Label preview next to handle */}
                        <span className="absolute left-[50px] text-[9px] uppercase font-bold tracking-tighter text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-neutral-900/80 px-1.5 py-0.5 rounded border border-neutral-800">
                            {rule.label || `Case ${index + 1}`}
                        </span>
                    </div>
                );
            })}

            {/* DEFAULT / ELSE HANDLE */}
            {includeDefault && (
                <div className="relative flex items-center justify-end group pointer-events-auto mt-auto pt-4 border-t border-neutral-800/50">
                    <span className="absolute right-8 text-[9px] uppercase font-bold tracking-tighter text-amber-500/50">
                        Default (Else)
                    </span>
                    <NodeHandle
                        node={node}
                        type="source"
                        position={Position.Right}
                        id="default-else"
                        className="-right-[35px]! border-amber-900/30! bg-neutral-900 hover:bg-amber-600 transition-all"
                    />
                </div>
            )}
        </div>
    );
}