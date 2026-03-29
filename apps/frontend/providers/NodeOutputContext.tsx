"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {SchemaField} from "../../shared/src/types/node.types";

type NodeOutputContextType = {
    nodeOutputs: Record<string, Record<string, SchemaField>>;
    setNodeOutput: (nodeId: string, schema: Record<string, SchemaField>) => void;
};

export const NodeOutputContext = createContext<NodeOutputContextType | undefined>(undefined);

export const NodeOutputProvider = ({ children }: { children: ReactNode }) => {
    const [nodeOutputs, setNodeOutputs] = useState<Record<string, Record<string, SchemaField>>>({});

    const setNodeOutput = (nodeId: string, schema: Record<string, SchemaField>) => {
        setNodeOutputs(prev => ({ ...prev, [nodeId]: schema }));
    };

    return (
        <NodeOutputContext.Provider value={{ nodeOutputs, setNodeOutput }}>
            {children}
        </NodeOutputContext.Provider>
    );
};