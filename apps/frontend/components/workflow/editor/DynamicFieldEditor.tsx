"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNodeOutputs } from "@/hooks/useNodeOutputs";
import type {FieldInput} from "@neuron/shared";
import {convertFieldInputToSchema} from "@/lib/utils";

interface DynamicFieldEditorProps {
    nodeId: string;
    initialFields?: FieldInput[];
}

export const DynamicFieldEditor = ({ nodeId, initialFields = [] }: DynamicFieldEditorProps) => {
    const { setNodeOutput } = useNodeOutputs();
    const [fields, setFields] = useState<FieldInput[]>(initialFields);

    useEffect(() => {
        const schema = convertFieldInputToSchema(fields);
        const timer = setTimeout(() => {
            setNodeOutput(nodeId, schema);
        })

        return () => {
            if (timer) {
                clearTimeout(timer)
            }
        }
    }, [fields, nodeId, setNodeOutput]);

    const handleFieldChange = (id: string, key: keyof FieldInput, value: any) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const addField = () => {
        const newField: FieldInput = { id: crypto.randomUUID(), name: "", type: "string" };
        setFields(prev => [...prev, newField]);
    };

    const removeField = (id: string) => setFields(prev => prev.filter(f => f.id !== id));

    return (
        <div className="flex flex-col space-y-2">
            {fields.map(field => (
                <div key={field.id} className="flex items-center space-x-2">
                    <Input
                        placeholder="Field Name"
                        value={field.name}
                        onChange={e => handleFieldChange(field.id, "name", e.target.value)}
                        className="text-xs"
                    />
                    <Select value={field.type} onValueChange={value => handleFieldChange(field.id, "type", value)}>
                        <SelectTrigger className="w-24 text-xs">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">Array</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button size="sm" variant="destructive" onClick={() => removeField(field.id)}>Remove</Button>
                    {/* Nested fields */}
                    {field.type === "object" && (
                        <div className="ml-6 border-l pl-2 mt-2">
                            <DynamicFieldEditor
                                nodeId={nodeId}
                                initialFields={field.children}
                            />
                        </div>
                    )}
                </div>
            ))}
            <Button size="sm" onClick={addField}>+ Add Field</Button>
        </div>
    );
};