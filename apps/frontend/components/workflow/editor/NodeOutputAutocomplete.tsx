"use client";

import React from "react";
import { useNodeOutputs } from "@/hooks/useNodeOutputs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface NodeOutputAutocompleteProps {
    onSelect: (path: string) => void; // e.g., "httpRequest.response.data"
}

export const NodeOutputAutocomplete = ({ onSelect }: NodeOutputAutocompleteProps) => {
    const { nodeOutputs } = useNodeOutputs();

    const renderFields = (fields: Record<string, any>, prefix = ""): string[] => {
        let results: string[] = [];
        for (const key in fields) {
            const path = prefix ? `${prefix}.${key}` : key;
            if (fields[key].type === "object") {
                results = results.concat(renderFields(fields[key].children || {}, path));
            } else if (fields[key].type === "array" && fields[key].arrayItem?.type === "object") {
                results = results.concat(renderFields(fields[key].arrayItem.children || {}, path + "[]"));
            } else {
                results.push(path);
            }
        }
        return results;
    };

    const allPaths = Object.entries(nodeOutputs).flatMap(([nodeId, schema]) =>
        renderFields(schema, nodeId)
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="sm">Insert Node Output</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {allPaths.map(path => (
                    <DropdownMenuItem key={path} onClick={() => onSelect(`{{ ${path} }}`)}>
                        {path}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};