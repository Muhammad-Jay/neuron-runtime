"use client";

import { createContext, useCallback, useEffect, useReducer, useRef, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { WorkflowEditorAction } from "@/types/workflow";
import type {WorkflowDefinition, WorkflowType, NodeType, WorkflowNode, WorkflowEdge} from "@neuron/shared";
import { NodeTemplate, WorkflowEditorActionType } from "@/constants";
import { Node, useReactFlow, Edge } from "reactflow";
import {
    deleteDeploymentRequest,
    deployWorkflowRequest,
    getDeployWorkflowRequest,
    getWorkflowGraphRequest,
    runWorkflowRequest,
    saveWorkflowGraphRequest
} from "@/lib/api-client/client";
import { createClient } from "@/lib/supabase/client";
import { arrayToGlobalVariables, globalVariablesToArray, toReactFlowNode } from "@/lib/utils"
import { toast } from "sonner";
import { useWorkflowRealtime } from "@/hooks/workflow/useWorkflowRealtime";

export type WorkflowEditorContextType = {
    editorState: IWorkflowEditorState;
    workflowEditorDispatch: (WorkflowEditorAction: WorkflowEditorAction) => void;
    selectedNode: Node | null | undefined;
    setSelectedNode: (selectedNode: Node | null | undefined) => void;
    isSheetOpen: boolean;
    setIsSheetOpen: (isSheetOpen: boolean) => void;
    openConfigSheet: boolean;
    setOpenConfigSheet: (openConfigSheet: boolean) => void;
    sheetOpen: boolean;
    setSheetOpen: (sheetOpen: boolean) => void;
    isGlobalVariableSheetOpen: boolean;
    setIsGlobalVariableSheetOpen: (isGlobalVariableSheetOpen: boolean) => void;
    isEditorPanelOpen: boolean;
    setIsEditorPanelOpen: (isEditorPanelOpen: boolean) => void;
    isDeployWorkflowDialogOpen: boolean;
    setIsDeployWorkflowDialogOpen: (isDeployWorkflowDialogOpen: boolean) => void;
    isWorkflowLoading: boolean;
    setIsWorkflowLoading: (isWorkflowLoading: boolean) => void;
    isWorkflowSaving: boolean;
    isRunning: boolean;
    isDeploying: boolean;

    handleSelectTemplate: (template: NodeTemplate, node?: Node) => void;

    saveWorkflowGraph: () => void;
    handleRunWorkflow: () => void;
    deployWorkflow: (data: {
        private: boolean,
        secretKey: string,
    }) => void;
    deleteDeployment: () => void;

    selectedHandle: string | null;
    setSelectedHandle: (value: string | null) => void;

    fitNode: (node: WorkflowNode) => void;

    // Derived values for ReactFlow
    rfNodes: Node[];
    rfEdges: Edge[];
};

export interface IWorkflowEditorState {
    workflowId: string;
    graph: WorkflowDefinition;
    workflow: WorkflowType;
    runtime: {
        nodeStatus: Record<string, "idle" | "running" | "success" | "error">
        nodeOutputs: Record<string, any>
        nodeErrors: Record<string, string>
        activeEdges: Record<string, boolean>
    };
    executions?: any[] | null;
    executionLogs?: any[] | null;
    globalVariables: Record<string, any>;
    deployment: Record<string, any> | null;
    isDirty: boolean;
}

const initialState: IWorkflowEditorState = {
    workflowId: "",
    graph: {
        nodes: {},
        edges: {},
    },
    workflow: {
        id: "",
        name: "",
        description: "",
        status: "draft",
        userId: "",
    },
    runtime: {
        nodeStatus: {},
        nodeErrors: {},
        nodeOutputs: {},
        activeEdges: {},
    },
    globalVariables: {},
    deployment: null,
    isDirty: false,
};

export const WorkflowEditorContext = createContext<WorkflowEditorContextType | null>(null);

export function WorkflowEditorProvider({ children }: { children: React.ReactNode }) {
    const workflowId = useParams().workflowId as string;
    const { fitView, addNodes, addEdges } = useReactFlow();
    const saveTimeout = useRef<NodeJS.Timeout | null>(null);

    const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
    const [isWorkflowSaving, setIsWorkflowSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [openConfigSheet, setOpenConfigSheet] = useState(false);
    const [isGlobalVariableSheetOpen, setIsGlobalVariableSheetOpen] = useState(false);
    const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(true);
    const [isDeployWorkflowDialogOpen, setIsDeployWorkflowDialogOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    const [editorState, workflowEditorDispatch] = useReducer(workflowEditorReducer, initialState);
    const [selectedNode, setSelectedNode] = useState<Node | null | undefined>();
    const [selectedHandle, setSelectedHandle] = useState<string | null>(null);

    // --- REFACTORED REDUCER FOR RECORD LOOKUP ---
    function workflowEditorReducer(
        state: IWorkflowEditorState,
        action: WorkflowEditorAction
    ): IWorkflowEditorState {
        switch (action.type) {
            case WorkflowEditorActionType.SET_WORKFLOW_ID:
                return { ...state, workflowId: action.workflowId };

            case WorkflowEditorActionType.SET_GRAPH:
                return { ...state, graph: action.payload, isDirty: false };

            case WorkflowEditorActionType.ADD_NODE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: { ...state.graph.nodes, [action.payload.id]: action.payload },
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.UPDATE_NODE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: {
                            ...state.graph.nodes,
                            [action.id]: {
                                ...state.graph.nodes[action.id],
                                config: { ...action.payload }
                            }
                        },
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.UPDATE_NODE_POSITION: {
                const node = state.graph.nodes[action.id];
                if (!node) return state;
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: {
                            ...state.graph.nodes,
                            [action.id]: {
                                ...node,
                                position: {
                                    x: Math.round(action.position.x),
                                    y: Math.round(action.position.y)
                                }
                            }
                        },
                    },
                    isDirty: true,
                };
            }

            case WorkflowEditorActionType.DELETE_NODE: {
                const newNodes = { ...state.graph.nodes };
                delete newNodes[action.id];
                return {
                    ...state,
                    graph: { ...state.graph, nodes: newNodes },
                    isDirty: true,
                };
            }

            case WorkflowEditorActionType.ADD_EDGE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        edges: { ...state.graph.edges, [action.payload.id]: action.payload },
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.DELETE_EDGE: {
                const newEdges = { ...state.graph.edges };
                delete newEdges[action.id];
                return {
                    ...state,
                    graph: { ...state.graph, edges: newEdges },
                    isDirty: true,
                };
            }

            case WorkflowEditorActionType.UPDATE_EDGE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        edges: {
                            ...state.graph.edges,
                            [action.id]: { ...state.graph.edges[action.id], ...action.payload }
                        },
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.RESET_NODE_STATUS:
                return {
                    ...state,
                    runtime: { ...state.runtime, nodeStatus: {}, nodeErrors: {}, nodeOutputs: {} }
                }

            case WorkflowEditorActionType.NODE_EXECUTION_START:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: { ...state.runtime.nodeStatus, [action.nodeId]: "running" }
                    }
                };

            case WorkflowEditorActionType.NODE_EXECUTION_SUCCESS:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: { ...state.runtime.nodeStatus, [action.nodeId]: "success" },
                        nodeOutputs: { ...state.runtime.nodeOutputs, [action.nodeId]: action.output }
                    }
                }

            case WorkflowEditorActionType.UPDATE_GLOBAL_VARS:
                return { ...state, globalVariables: action.payload, isDirty: true };

            case WorkflowEditorActionType.SET_DEPLOYMENT:
                return { ...state, deployment: action.payload };

            case WorkflowEditorActionType.UPDATE_DIRTY_STATE:
                return { ...state, isDirty: action.state ?? false };

            default:
                return state;
        }
    }

    // 1. Memoized Nodes with Selection State
    const rfNodes = useMemo(() => {
        return Object.values(editorState.graph.nodes).map((node) => {
            const rfNode = toReactFlowNode(node);
            return {
                ...rfNode,
                selected: selectedNode?.id === node.id,
            };
        });
    }, [editorState.graph.nodes, selectedNode?.id]);

// 2. Memoized Edges with Runtime Animation Logic
    const rfEdges = useMemo(() => {
        return Object.values(editorState.graph.edges).map((edge) => {
            const isActive = !!editorState.runtime.activeEdges?.[edge.id];

            return {
                ...edge,
                type: "default",
                animated: isActive,
                // Styling for the "Active Pulse" effect
                style: {
                    stroke: isActive ? "#ffffff" : "#3f3f46",
                    strokeWidth: isActive ? 3 : 2,
                    transition: 'stroke 0.4s ease, stroke-width 0.4s ease',
                    opacity: isActive ? 1 : 1,
                },
            };
        });
    }, [editorState.graph.edges, editorState.runtime.activeEdges]);

    useWorkflowRealtime(workflowId, workflowEditorDispatch);

    const getSession = useCallback(async () => {
        const supabase = createClient();
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) throw new Error("No active session found");
        return session.access_token;
    }, []);

    const loadWorkflow = async () => {
        try {
            setIsWorkflowLoading(true);
            const token = await getSession();
            const response = await getWorkflowGraphRequest(workflowId, token);

            const nodesRecord: Record<string, WorkflowNode> = {};
            response.graph.nodes.forEach((n: any) => {
                nodesRecord[n.id] = {
                    id: n.id,
                    type: n.type as NodeType,
                    position: { x: n.positionX, y: n.positionY },
                    config: n.config
                };
            });

            const edgesRecord: Record<string, WorkflowEdge> = {};
            response.graph.edges.forEach((e) => {
                edgesRecord[e.id] = {
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    sourceHandle: e.sourceHandle,
                    targetHandle: e.targetHandle,
                };
            });

            workflowEditorDispatch({
                type: WorkflowEditorActionType.SET_GRAPH,
                payload: { nodes: nodesRecord, edges: edgesRecord },
            });

            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS,
                payload: arrayToGlobalVariables(response.globalVariables)
            });

            await loadDeployment();
        } catch (e) {
            console.error(e.message);
        } finally {
            setIsWorkflowLoading(false);
        }
    };

    const saveWorkflowGraph = async () => {
        try {
            setIsWorkflowSaving(true);
            const token = await getSession();

            // Convert Records back to Arrays for the API payload
            const payload = {
                graph: {
                    nodes: Object.values(editorState.graph.nodes),
                    edges: Object.values(editorState.graph.edges),
                },
                globalVariables: globalVariablesToArray(editorState.globalVariables),
            };

            await saveWorkflowGraphRequest(workflowId, token, payload);
            workflowEditorDispatch({ type: WorkflowEditorActionType.UPDATE_DIRTY_STATE, state: false });
        } catch (e) {
            console.error(e.message);
        } finally {
            setIsWorkflowSaving(false);
        }
    };

    const handleSelectTemplate = (template: NodeTemplate, node?: Node) => {
        const newNodeId = crypto.randomUUID();
        const newNode: WorkflowNode = {
            id: newNodeId,
            type: template.type as NodeType,
            position: {
                x: node ? node.position.x + 300 : 200,
                y: node ? node.position.y + 300 : 300,
            },
            config: template.defaultConfig as any,
        };

        workflowEditorDispatch({ type: WorkflowEditorActionType.ADD_NODE, payload: newNode });
        addNodes(toReactFlowNode(newNode));

        if (selectedNode) {
            const newEdge = {
                id: crypto.randomUUID(),
                source: selectedNode.id,
                target: newNodeId,
                sourceHandle: selectedHandle,
                targetHandle: newNodeId,
                type: "default",
            };
            workflowEditorDispatch({ type: WorkflowEditorActionType.ADD_EDGE, payload: newEdge });
            addEdges(newEdge);
        }

        setSelectedHandle(null);
        setIsSheetOpen(false);
    };

    const handleRunWorkflow = async () => {
        workflowEditorDispatch({ type: WorkflowEditorActionType.RESET_NODE_STATUS });
        try {
            setIsRunning(true);
            toast.message("Running Workflow");
            const token = await getSession();

            await runWorkflowRequest(workflowId, token);
            toast.success("Execution complete.");
        } catch (e) {
            toast.error(e.message);
        } finally {
            setIsRunning(false);
        }
    };

    const loadDeployment = async () => {
        try {
            const token = await getSession();
            const deployment = await getDeployWorkflowRequest(workflowId, token);
            if (deployment) {
                workflowEditorDispatch({ type: WorkflowEditorActionType.SET_DEPLOYMENT, payload: deployment });
            }
        } catch (e) { console.error(e.message); }
    };

    const deployWorkflow = async (data: { private: boolean, secretKey: string }) => {
        const nodes = Object.values(editorState.graph.nodes);
        if (nodes.length === 0) return;
        try {
            setIsDeploying(true);
            const token = await getSession();
            const deployed = await deployWorkflowRequest(workflowId, {
                ...data,
                name: editorState.workflow.name,
                nodes: nodes,
                edges: Object.values(editorState.graph.edges)
            }, token);
            workflowEditorDispatch({ type: WorkflowEditorActionType.SET_DEPLOYMENT, payload: deployed[0] });
            toast.success("Workflow deployed.");
        } catch (e) { toast.error(e.message); } finally { setIsDeploying(false); }
    };

    const deleteDeployment = async () => {
        try {
            const token = await getSession();
            await deleteDeploymentRequest(workflowId, token);
            workflowEditorDispatch({ type: WorkflowEditorActionType.SET_DEPLOYMENT, payload: null });
            toast.success("Deployment terminated.");
        } catch (e) { toast.error(e.message); }
    };

    const fitNode = (node: WorkflowNode) => {
        fitView({ nodes: [{ id: node.id }], duration: 800, padding: 0.05, maxZoom: 1.1 });
    };

    useEffect(() => {
        if (!editorState.isDirty) return;
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
            saveWorkflowGraph();
        }, 2000);
        return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
    }, [editorState.graph, editorState.globalVariables]);

    useEffect(() => {
        if (workflowId) loadWorkflow();
    }, [workflowId]);

    return (
        <WorkflowEditorContext.Provider value={{
            editorState,
            workflowEditorDispatch,
            selectedNode,
            setSelectedNode,
            selectedHandle,
            setSelectedHandle,
            isSheetOpen,
            setIsSheetOpen,
            isGlobalVariableSheetOpen,
            setIsGlobalVariableSheetOpen,
            isEditorPanelOpen,
            setIsEditorPanelOpen,
            isDeployWorkflowDialogOpen,
            setIsDeployWorkflowDialogOpen,
            isWorkflowLoading,
            setIsWorkflowLoading,
            isWorkflowSaving,
            sheetOpen,
            setSheetOpen,
            openConfigSheet,
            setOpenConfigSheet,
            isRunning,
            handleSelectTemplate,
            saveWorkflowGraph,
            handleRunWorkflow,
            fitNode,
            isDeploying,
            deployWorkflow,
            deleteDeployment,
            rfNodes,
            rfEdges
        }}>
            {children}
        </WorkflowEditorContext.Provider>
    );
}