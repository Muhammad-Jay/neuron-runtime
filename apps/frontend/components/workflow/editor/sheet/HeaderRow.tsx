'use client';

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react";
import {TemplateTextarea} from "@/components/workflow/editor/TemplateTextarea";

interface HeaderRowProps {
    headerKey: string
    value: string
    variables: any[]
    onChangeKey: (value: string) => void
    onChangeValue: (value: string) => void
    onDelete: () => void
}

export function HeaderRow({
                              headerKey,
                              value,
                              onChangeKey,
                              onChangeValue,
    variables,
                              onDelete
                          }: HeaderRowProps) {
    // 1. Initialize local state ONLY ONCE from the initial props
    const [hKey, setHKey] = useState(headerKey);
    const [hValue, setHValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHKey(headerKey);
            setHValue(value);
        }, 50);

        return () => clearTimeout(timer);
    }, [headerKey, value]);

    // 3. Debounced update for the KEY
    useEffect(() => {
        if (hKey === headerKey) return;
        const timer = setTimeout(() => {
            onChangeKey(hKey);
        }, 500); // Slightly longer delay for key stability
        return () => clearTimeout(timer);
    }, [hKey, headerKey, onChangeKey]);

    // 4. Debounced update for the VALUE
    useEffect(() => {
        if (hValue === value) return;
        const timer = setTimeout(() => {
            onChangeValue(hValue);
        }, 500);
        return () => clearTimeout(timer);
    }, [hValue, value, onChangeValue]);

    return (
        <div className="flex items-center gap-2">
            <Input
                value={hKey}
                onChange={(e) => setHKey(e.target.value)}
                placeholder="Key"
                className="text-xs h-8 bg-neutral-900/50 border-neutral-800 focus:border-primary/50"
            />
            {/*<Input*/}
            {/*    value={hValue}*/}
            {/*    onChange={(e) => setHValue(e.target.value)}*/}
            {/*    placeholder="Value"*/}
            {/*    className="text-xs h-8 bg-neutral-900/50 border-neutral-800 focus:border-primary/50"*/}
            {/*/>*/}
            <TemplateTextarea
                value={hValue}
                variables={variables}
                onChange={(val) => {
                    setHValue(val)
                }}
                placeholder="Value"
            />
            <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onDelete}
                className="h-8 w-8 text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
            >
                <Trash2 className="h-3.5 w-3.5" />
            </Button>
        </div>
    );
}