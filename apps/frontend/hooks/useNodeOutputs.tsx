'use client';

import { useContext } from "react";
import {NodeOutputContext} from "@/providers/NodeOutputContext";

export const useNodeOutputs = () => {
    const context = useContext(NodeOutputContext);
    if (!context) throw new Error("useNodeOutputs must be used within NodeOutputProvider");
    return context;
};