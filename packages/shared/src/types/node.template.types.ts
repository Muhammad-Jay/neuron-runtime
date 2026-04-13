import {NodeConfigType, NodeType} from "./node.types";
import {LucideIcon} from "lucide-react";

export interface NodeTemplate {
    key: string;
    type: NodeType;
    label: string;
    category: 'Logic' | 'Network' | 'AI' | 'Communication' | 'Data';
    description: string;
    icon: LucideIcon;
    defaultConfig: NodeConfigType;
}