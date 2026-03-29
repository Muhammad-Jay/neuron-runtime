'use client';

import { Button } from "@/components/ui/button"
import { HeaderRow } from "./HeaderRow"
import { Plus } from "lucide-react";

interface HeadersEditorProps {
    headers: Record<string, string>
    onChange: (headers: Record<string, string>) => void
    variables: any[]
}

export function HeadersEditor({ headers = {}, onChange, variables }: HeadersEditorProps) {
    const safeHeaders = headers || {};

    const addHeader = () => {
        onChange({
            ...safeHeaders,
            [`field_${Object.keys(safeHeaders).length + 1}`]: ""
        });
    };

    const updateHeaderKey = (oldKey: string, newKey: string) => {
        if (oldKey === newKey || !newKey) return;

        const updated = { ...safeHeaders };
        const existingValue = updated[oldKey];

        delete updated[oldKey];
        updated[newKey] = existingValue; // Explicitly re-map the value

        onChange(updated);
    };

    const updateHeaderValue = (key: string, newValue: string) => {
        console.log(key, newValue);
        onChange({
            ...safeHeaders,
            [key]: newValue
        });
    };

    const deleteHeader = (key: string) => {
        const updated = { ...safeHeaders };
        delete updated[key];
        onChange(updated);
    };

    return (
        <div className="space-y-2">
            {Object.entries(safeHeaders).map(([key, value]) => (
                <HeaderRow
                    key={key} // Key is stable here
                    headerKey={key}
                    value={value}
                    variables={variables}
                    onChangeKey={(v) => updateHeaderKey(key, v)}
                    onChangeValue={(v) => updateHeaderValue(key, v)}
                    onDelete={() => deleteHeader(key)}
                />
            ))}

            <Button
                type="button"
                variant="outline"
                className="text-[10px] uppercase font-bold h-7 border-dashed border-neutral-800 bg-transparent text-neutral-500 hover:text-neutral-200"
                onClick={addHeader}
            >
                <Plus className="w-3 h-3 mr-1" />
                Add Row
            </Button>
        </div>
    );
}