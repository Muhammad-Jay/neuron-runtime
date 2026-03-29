"use client";

import {createContext, useCallback, useEffect, useReducer, useRef, useState} from "react";
import {useParams} from "next/navigation";
import {WorkflowEditorAction} from "@/types/workflow";
import type {WorkflowDefinition, WorkflowType, NodeType, WorkflowNode} from "@neuron/shared";
import {NodeTemplate, WorkflowEditorActionType} from "@/constants";
import {Node, useReactFlow} from "reactflow";
import {
    deleteDeploymentRequest,
    deployWorkflowRequest,
    getDeployWorkflowRequest,
    getWorkflowGraphRequest,
    runWorkflowRequest,
    saveWorkflowGraphRequest
} from "@/lib/api-client/client";
import {createClient} from "@/lib/supabase/client";
import {arrayToGlobalVariables, globalVariablesToArray, toReactFlowNode} from "@/lib/utils"
import {toast} from "sonner";
import {useWorkflowRealtime} from "@/hooks/workflow/useWorkflowRealtime";

export type WorkflowEditorContextType = {
    editorState: IWorkflowEditorState;
    workflowEditorDispatch: (WorkflowEditorAction: WorkflowEditorAction) => void;
    selectedNode: Node;
    setSelectedNode: (selectedNode: Node) => void;
    isSheetOpen: boolean;
    setIsSheetOpen: (isSheetOpen: boolean) => void;
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

    handleSelectTemplate: (template: NodeTemplate, node: Node) => void;

    saveWorkflowGraph: () => void;
    handleRunWorkflow: () => void;
    deployWorkflow: (data: {
        private: boolean,
        secretKey: string,
    }) => void;
    deleteDeployment: () => void;

    selectedHandle: string | null;
    setSelectedHandle: (value: string) => void;

    fitNode: (node: WorkflowNode) => void;
};

export interface IWorkflowEditorState {
    workflowId: string;
    graph:WorkflowDefinition;
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
        nodes: [],
        edges: [],
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

export function WorkflowEditorProvider({ children }) {
    const workflowId = useParams().workflowId as string;

    const { fitView, addNodes, addEdges } = useReactFlow();

    const  saveTimeout = useRef<NodeJS.Timeout | null>(null);


    const [isWorkflowLoading, setIsWorkflowLoading] = useState(false);
    const [isWorkflowSaving, setIsWorkflowSaving] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [isGlobalVariableSheetOpen, setIsGlobalVariableSheetOpen] = useState(false);
    const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(true);
    const [isDeployWorkflowDialogOpen, setIsDeployWorkflowDialogOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    const [editorState, workflowEditorDispatch] = useReducer(workflowEditorReducer, initialState);
    const [selectedNode, setSelectedNode] = useState<Node | null>();
    const [selectedHandle, setSelectedHandle] = useState<string | null>(null);

    // Workflow Realtime
    useWorkflowRealtime(workflowId, workflowEditorDispatch);

    const getSession = useCallback(async () => {
        const supabase = createClient();

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            throw new Error("No active session found");
        }

        return session.access_token;
    }, [])

    function workflowEditorReducer(
        state: IWorkflowEditorState,
        action: WorkflowEditorAction
    ): IWorkflowEditorState {
        switch (action.type) {
            case WorkflowEditorActionType.SET_WORKFLOW_ID:
                return {
                    ...state,
                    workflowId: action.workflowId,
                };

            case WorkflowEditorActionType.SET_GRAPH:
                return {
                    ...state,
                    graph: action.payload,
                    isDirty: false,
                };
            case WorkflowEditorActionType.ADD_NODE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: [...state.graph.nodes, action.payload],
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.ADD_EDGE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        edges: [...state.graph.edges, action.payload],
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.DELETE_NODE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: state.graph.nodes.filter(node => node.id !== action.id),
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.DELETE_EDGE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        edges: state.graph.edges.filter(edge => edge.id !== action.id),
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.UPDATE_NODE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: state.graph.nodes.map(node =>
                            node.id === action.id
                                ? { ...node, config: {
                                    ...action.payload
                                } }
                                : node
                        ),
                    },
                    isDirty: true,
                };
            case WorkflowEditorActionType.UPDATE_NODE_POSITION:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        nodes: state.graph.nodes.map((node) => {
                            if (node.id !== action.id) return node;

                            if (
                                node.position.x === action.position.x &&
                                node.position.y === action.position.y
                            ) {
                                return node;
                            }

                            return {
                                ...node,
                                position: {
                                    x: Math.round(action.position.x),
                                    y: Math.round(action.position.y)
                                },
                            };
                        }),
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.UPDATE_EDGE:
                return {
                    ...state,
                    graph: {
                        ...state.graph,
                        edges: state.graph.edges.map(edge =>
                            edge.id === action.id
                                ? { ...edge, ...action.payload }
                                : edge
                        ),
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.UPDATE_DIRTY_STATE:
                return {
                    ...state,
                    isDirty: action.state ?? false,
                }

            case WorkflowEditorActionType.RESET_NODE_STATUS:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: {},
                        nodeErrors: {},
                        nodeOutputs: {}
                    }
                }

            case WorkflowEditorActionType.NODE_EXECUTION_START:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: {
                            ...state.runtime.nodeStatus,
                            [action.nodeId]: "running"
                        }
                    }
                };

            case WorkflowEditorActionType.NODE_EXECUTION_SUCCESS:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: {
                            ...state.runtime.nodeStatus,
                            [action.nodeId]: "success"
                        },
                        nodeOutputs: {
                            ...state.runtime.nodeOutputs,
                            [action.nodeId]: action.output
                        }
                    }
                }

            case WorkflowEditorActionType.NODE_EXECUTION_ERROR:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: {
                            ...state.runtime.nodeStatus,
                            [action.nodeId]: "error"
                        },
                        nodeErrors: {
                            ...state.runtime.nodeErrors,
                            [action.nodeId]: action.error
                        }
                    }
                }

            case WorkflowEditorActionType.EDGE_EXECUTION_START:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        activeEdges: {
                            ...state.runtime.activeEdges,
                            [action.edgeId]: true
                        }
                    }
                }

            case WorkflowEditorActionType.EDGE_EXECUTION_END:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        activeEdges: {
                            ...state.runtime.activeEdges,
                            [action.edgeId]: false
                        }
                    }
                }

            case WorkflowEditorActionType.UPDATE_STATUS:
                return {
                    ...state,
                    workflow: {
                        ...state.workflow,
                        status: action.status,
                    },
                    isDirty: true,
                };

            case WorkflowEditorActionType.UPDATE_GLOBAL_VARS:
                return {
                    ...state,
                    globalVariables: action.payload,
                    isDirty: true,
                }

            case WorkflowEditorActionType.SET_DEPLOYMENT:
                return {
                    ...state,
                    deployment: action.payload,
                }

            case WorkflowEditorActionType.UPDATE_DEPLOYMENT:
                return {
                    ...state,
                    deployment: {
                        ...state.deployment,
                        ...action.payload,
                    }
                }

            default:
                return state;
        }
    }

    const loadWorkflow = async () => {
        try {
            setIsWorkflowLoading(true);

            const token = await getSession();

            const response = await getWorkflowGraphRequest(workflowId as string, token);

            workflowEditorDispatch({
                type: WorkflowEditorActionType.SET_GRAPH,
                payload: {
                    nodes: response.graph.nodes.map(node => ({
                        id: node.id,
                        type: node.type as NodeType,
                        position: {
                            x: node.positionX,
                            y: node.positionY,
                        },
                        config: node.config
                    })),
                    edges: response.graph.edges.map(edge => ({
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        sourceHandle: edge.sourceHandle,
                        targetHandle: edge.targetHandle,
                    })),
                },
            })

            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS,
                payload: arrayToGlobalVariables(response.globalVariables)
            })

            await loadDeployment();
            console.log("Get workflow graph response", response);

        }catch (e) {
            console.log(e.message);
        }finally {
            setIsWorkflowLoading(false);
        }
    };

    const saveWorkflowGraph = async () => {
        try {
            setIsWorkflowSaving(true);

            const token = await getSession();

            const payload = {
                graph: editorState.graph,
                globalVariables: globalVariablesToArray(editorState.globalVariables),
            };

            const response = await saveWorkflowGraphRequest(workflowId as string, token, payload);

            console.log("Save Graph Response", response);
        }catch (e) {
            console.log(e.message);
        }finally {
            setIsWorkflowSaving(false);
        }
    }

    const handleSelectTemplate = (template: NodeTemplate, node?: Node) => {
        const newNodeId = crypto.randomUUID();

        workflowEditorDispatch({
            type: WorkflowEditorActionType.RESET_NODE_STATUS
        });

        const newNode: WorkflowNode = {
            id: newNodeId,
            type: template.type as NodeType,
            position: {
                x: node ? node.position.x + 300 : 200,
                y: node ? node.position.y + 300 : 300,
            },
            config: template.defaultConfig as any,
        }

        const rfNode = toReactFlowNode(newNode);

        // Add node to reducer
        workflowEditorDispatch({
            type: WorkflowEditorActionType.ADD_NODE,
            payload: newNode,
        })

        // Add node to ReactFlow
        addNodes(rfNode);

        if (!selectedNode){
            setIsSheetOpen(false);
            return;
        }

        // Automatically connect the handle node to new node
        const newEdge = {
            id: crypto.randomUUID(),
            source: selectedNode.id,
            target: newNodeId,
            sourceHandle: selectedHandle,
            targetHandle: newNodeId,
            type: "default",
        }

        workflowEditorDispatch({
            type: WorkflowEditorActionType.ADD_EDGE,
            payload: newEdge,
        })

        addEdges(newEdge)

        setSelectedHandle(null);
        setIsSheetOpen(false)
    }

    const handleRunWorkflow = async () => {

        workflowEditorDispatch({
            type: WorkflowEditorActionType.RESET_NODE_STATUS
        })

        try {
            setIsRunning(true);
            toast.message("Running Workflow");

            const token = await getSession();

            const result = await runWorkflowRequest(workflowId as string, editorState.graph, token);

            console.log("Workflow result:", result)
            toast.success("Workflow result:", {
                description: "the workflow was executed successfully.",
            })
        }catch (e) {
            console.log(e.message);
            toast.error(e.message);
        }finally {
            setIsRunning(false);
        }

    }

// --- GET DEPLOYMENT ---
    const loadDeployment = async () => {
        try {
            const token = await getSession();

            const deployment = await getDeployWorkflowRequest(workflowId, token);

            if (deployment){
                workflowEditorDispatch({
                    type: WorkflowEditorActionType.SET_DEPLOYMENT,
                    payload: {...deployment}
                })
            }
        }catch (e) {
            console.log(e.message);
            toast.error(e.message);
        }finally {

        }
    }

// --- DEPLOY WORKFLOW ---
    const deployWorkflow = async (data: {
        private: boolean,
        secretKey: string,
    }) => {
        if (editorState.graph.nodes.length === 0) return;
        
        try {
            setIsDeploying(true);
            const token = await getSession();


            const deployedWorkflow = await deployWorkflowRequest(
                workflowId,
                {
                    ...data,
                    name: editorState.workflow.name,
                    nodes: editorState.graph.nodes,
                    edges: editorState.graph.edges
                },
                token
            );

            console.log("Deployed workflow deployment:", deployedWorkflow);

            workflowEditorDispatch({
                type: WorkflowEditorActionType.SET_DEPLOYMENT,
                payload: deployedWorkflow[0]
            })
            toast.success("Workflow deployed successfully.");
        }catch (e) {
            console.log(e.message);
            toast.error(e.message);
        }finally {
            setIsDeploying(false);
        }
    }

    const deleteDeployment = async () => {
        try {
            const token = await getSession();

            const response = await deleteDeploymentRequest(workflowId, token);

            workflowEditorDispatch({
                type: WorkflowEditorActionType.SET_DEPLOYMENT,
                payload: null
            })

            toast.success(response.message ?? "Deployment Dismantled. Endpoint is now offline.");

            toast.success(response.message);
        } catch (error) {
            toast.error(error.message ?? "Failed to terminate deployment.");
        }
    };

    const fitNode = (node: WorkflowNode) => {
        const rfNode = toReactFlowNode(node);

        fitView({
            nodes: [{ id: rfNode.id }],
            duration: 800,
            padding: 0.05,
            maxZoom: 1.1,
            minZoom: .5
        })
    }

    useEffect(() => {

        if (!editorState.isDirty) return

        if (saveTimeout.current) {
            clearTimeout(saveTimeout.current)
        }

        saveTimeout.current = setTimeout(() => {

            try {
                setIsWorkflowSaving(true);

                saveWorkflowGraph().then(() => {

                    // workflowEditorDispatch({
                    //     type: WorkflowEditorActionType.SET_GRAPH,
                    //     payload: editorState.graph,
                    // })

                })

            }catch (e) {
                console.log(e.message);
            }finally {
                setIsWorkflowSaving(false);
            }

        }, 2000)

        return () => {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current)
            }
        }

    }, [editorState.graph, editorState.globalVariables])

    useEffect(() => {
        if (workflowId) {
            loadWorkflow().then(() => console.log("Workflow Editor Loaded"));
        }
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
            isRunning,
            handleSelectTemplate,
            saveWorkflowGraph,
            handleRunWorkflow,
            fitNode,
            isDeploying,
            deployWorkflow,
            deleteDeployment,
        }}>
            {children}
        </WorkflowEditorContext.Provider>
    );
}