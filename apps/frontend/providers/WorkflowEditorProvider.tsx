"use client";

import {createContext, useCallback, useEffect, useMemo, useReducer, useRef, useState} from "react";
import {useParams} from "next/navigation";
import {WorkflowEditorAction} from "@/types/workflow";
import type {NodeType, WorkflowDefinition, WorkflowEdge, WorkflowNode, WorkflowType} from "@neuron/shared";
import {NodeTemplate, WorkflowEditorActionType} from "@/constants";
import {Edge, Node, useReactFlow} from "reactflow";
import {
    deleteDeploymentRequest,
    deployWorkflowRequest,
    getDeployWorkflowRequest,
    getExecutionsLogsRequest,
    getWorkflowGraphRequest,
    runWorkflowRequest,
    saveWorkflowGraphRequest
} from "@/lib/api-client/client";
import {createClient} from "@/lib/supabase/client";
import {arrayToGlobalVariables, globalVariablesToArray, toReactFlowNode} from "@/lib/utils"
import {toast} from "sonner";
import {useWorkflowRealtime} from "@/hooks/workflow/useWorkflowRealtime";
import {db} from "@/lib/db/workflow.db";
import {useLiveQuery} from "dexie-react-hooks";
import {Execution, ExecutionLog, RuntimeAction, RuntimeActionType, RuntimeState} from "@/types/index";

export type WorkflowEditorContextType = {
    editorState: IWorkflowEditorState;
    workflowEditorDispatch: (WorkflowEditorAction: WorkflowEditorAction) => void;
    runtimeState: RuntimeState;
    runtimeDispatch: (RuntimeAction: RuntimeAction) => void;

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
    isExecutionsSheetOpen: boolean;
    setIsExecutionsSheetOpen: (vlue: boolean) => void;
    isWorkflowInspectorOpen: boolean;
    setIsWorkflowInspectorOpen: (vlue: boolean) => void;

    handleSelectTemplate: (template: NodeTemplate, node?: Node) => void;

    saveWorkflowGraph: () => void;
    handleRunWorkflow: () => void;
    deployWorkflow: (data: {
        private: boolean,
        secretKey: string,
    }) => void;
    deleteDeployment: () => void;
    getExecutionLogs: (id: string) => any;

    selectedHandle: string | null;
    setSelectedHandle: (value: string | null) => void;

    fitNode: (node: WorkflowNode) => void;

    // Derived values for ReactFlow
    rfNodes: Node[];
    rfEdges: Edge[];

    logs: ExecutionLog[];
    setLogs: (logs: ExecutionLog[]) => void;
    isLogsLoading: boolean;
    setIsLogsLoading: (val: boolean) => void;
};

export interface IWorkflowEditorState {
    workflowId: string;
    graph: WorkflowDefinition;
    workflow: WorkflowType;
    runtime: {
        nodeStatus: Record<string, "idle" | "running" | "success" | "error">;
        nodeOutputs: Record<string, any> | null;
        nodeErrors: Record<string, string> | null;
        activeEdges: Record<string, boolean>;
        executions: Record<string, Execution>;
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
        nodeOutputs: null,
        activeEdges: {},
        executions: {},
    },
    globalVariables: {},
    deployment: null,
    isDirty: false,
};

export const initialRuntimeState: RuntimeState = {
    nodeStatus: {},
    activeEdges: {},
    executions: {},
    logs: {},
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
    const [isEditorPanelOpen, setIsEditorPanelOpen] = useState(false);
    const [isDeployWorkflowDialogOpen, setIsDeployWorkflowDialogOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [isExecutionsSheetOpen, setIsExecutionsSheetOpen] = useState(false);
    const [isWorkflowInspectorOpen, setIsWorkflowInspectorOpen] = useState(false);

    const [editorState, workflowEditorDispatch] = useReducer(workflowEditorReducer, initialState);
    const [runtimeState, runtimeDispatch] = useReducer(runtimeReducer, initialRuntimeState);
    
    const [selectedNode, setSelectedNode] = useState<Node | null | undefined>();
    const [selectedHandle, setSelectedHandle] = useState<string | null>(null);

    const [logs, setLogs] = useState<ExecutionLog[]>([]);
    const [isLogsLoading, setIsLogsLoading] = useState(false);

    const isSaving = useRef(false);
    const pendingSave = useRef(false);

    const localDraft = useLiveQuery(
        () => db.drafts.get(workflowId),
        [workflowId]
    );

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
                                config: { ...state.graph.nodes[action.id].config, ...action.payload }
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
                    runtime: { ...state.runtime, nodeStatus: {}, nodeErrors: {}, nodeOutputs: null }
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

            case WorkflowEditorActionType.NODE_EXECUTION_ERROR:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        nodeStatus: { ...state.runtime.nodeStatus, [action.nodeId]: "error" },
                        nodeErrors: { ...state.runtime.nodeErrors, [action.nodeId]: action.error}
                    }
                }

            case WorkflowEditorActionType.UPDATE_GLOBAL_VARS:
                return { ...state, globalVariables: action.payload, isDirty: true };

            case WorkflowEditorActionType.SET_DEPLOYMENT:
                return { ...state, deployment: action.payload };

            case WorkflowEditorActionType.UPDATE_DIRTY_STATE:
                return { ...state, isDirty: action.state ?? false };

            case WorkflowEditorActionType.SET_EXECUTIONS:
                return {
                    ...state,
                    runtime: {
                        ...state.runtime,
                        executions: action.payload,
                    }
                }

            default:
                return state;
        }
    }

    // --- EXECUTION REDUCER ---
    function runtimeReducer(state: RuntimeState, action: RuntimeAction): RuntimeState {
        switch (action.type) {
            case RuntimeActionType.SET_NODE_STATUS:
                return {
                    ...state,
                    nodeStatus: {
                        ...state.nodeStatus,
                        [action.nodeId]: action.status,
                    },
                };

            case RuntimeActionType.SET_EDGE_ACTIVE:
                return {
                    ...state,
                    activeEdges: {
                        ...state.activeEdges,
                        [action.edgeId]: action.isActive,
                    },
                };

            case RuntimeActionType.SET_EXECUTIONS:
                return {
                    ...state,
                   executions: action.payload
                }

            case RuntimeActionType.ADD_EXECUTION:
                return {
                    ...state,
                    executions: {
                        [action.execution.id]: action.execution,
                        ...state.executions,
                    },
                };

            case RuntimeActionType.UPDATE_EXECUTION:
                // Ensure the execution exists before spreading to avoid runtime crashes
                if (!state.executions[action.executionId]) return state;
                return {
                    ...state,
                    executions: {
                        ...state.executions,
                        [action.executionId]: {
                            ...state.executions[action.executionId],
                            ...action.payload
                        },
                    },
                };

            case RuntimeActionType.SET_LOGS:
                return {
                    ...state,
                    logs: action.payload
                };

            case RuntimeActionType.ADD_LOG:
                return {
                    ...state,
                    logs: {
                        ...state.logs,
                        [action.payload.id]: action.payload,
                    },
                };

            case RuntimeActionType.UPDATE_LOGS:
                const existingLog = state.logs[action.id];

                if (!existingLog) return state;

                return {
                    ...state,
                    logs: {
                        [action.id]: {
                            ...existingLog,
                            ...action.payload
                        },
                        ...state.logs,
                    }
                };

            case RuntimeActionType.RESET_FLOW_VISUALS:
                return {
                    ...state,
                    nodeStatus: {},
                    activeEdges: {},
                };

            case RuntimeActionType.CLEAR_RUNTIME:
                return initialRuntimeState;

            default:
                return state;
        }
    }

    const rfNodesData = useMemo(() => {
        return Object.values(editorState.graph.nodes).map((node) => toReactFlowNode(node));
    }, [editorState.graph.nodes]);

    const rfNodes = useMemo(() => {
        return rfNodesData.map((node) => ({
            ...node,
            selected: selectedNode?.id === node.id,
        }));
    }, [rfNodesData, selectedNode?.id]);

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

    useWorkflowRealtime(workflowId, workflowEditorDispatch, runtimeDispatch);

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

            console.log(response.graph.nodes);

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

            const executionRecord: Record<string, Execution> = {};
            response.executions.forEach((e: any) => {
                executionRecord[e.id] = e
            })

            workflowEditorDispatch({
                type: WorkflowEditorActionType.SET_GRAPH,
                payload: { nodes: nodesRecord, edges: edgesRecord },
            });

            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_GLOBAL_VARS,
                payload: arrayToGlobalVariables(response.globalVariables)
            });

            runtimeDispatch({
                type: RuntimeActionType.SET_EXECUTIONS,
                payload: executionRecord
            })

            // await getExecutionLogs(response.executions[0]?.id)

            console.log("Executions", executionRecord)

            await loadDeployment();
        } catch (e) {
            console.error(e.message);
        } finally {
            setIsWorkflowLoading(false);
        }
    };

    const saveWorkflowGraph = async () => {
        // 1. Double-check guard for parallel execution
        if (isSaving.current) {
            pendingSave.current = true;
            return;
        }

        isSaving.current = true;

        try {
            setIsWorkflowSaving(true);
            const token = await getSession();

            // 2. Fetch the latest draft from Dexie (The Single Source of Truth)
            const localDraft = await db.drafts.get(workflowId);
            if (!localDraft) return;

            const payload = {
                graph: {
                    nodes: Object.values(localDraft.graph.nodes) as WorkflowNode[],
                    edges: Object.values(localDraft.graph.edges) as WorkflowEdge[],
                },
                globalVariables: globalVariablesToArray(localDraft.globalVariables),
            };

            // 3. Push to Supabase
            await saveWorkflowGraphRequest(workflowId, token, payload);

            // 4. Atomic Update in Dexie: Mark as synced
            // We do this BEFORE dispatching to React to ensure the 'Disk' state is correct first
            await db.drafts.update(workflowId, {
                synced: true,
                updatedAt: Date.now()
            });

            // 5. Update React State (UI)
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_DIRTY_STATE,
                state: false,
            });

            toast.success("Changes synced to cloud", { id: "sync-toast" });

        } catch (e: any) {
            console.error("Sync failed:", e.message);
            // We don't mark as synced here, so the next debounce trigger will try again
            toast.error("Cloud sync failed. Working offline.");
        } finally {
            setIsWorkflowSaving(false);
            isSaving.current = false;

            // 6. Handle the "Trailing" Save
            // If the user kept typing while the network request was in flight
            if (pendingSave.current) {
                pendingSave.current = false;
                // Delay slightly to give the database/network a breather
                setTimeout(() => saveWorkflowGraph(), 1000);
            }
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

        setTimeout(() => {
            fitView({
                nodes: [{ id: newNodeId }],
                duration: 600,
                maxZoom: 1
            });
        }, 50);

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
            const deployment: any[] = await getDeployWorkflowRequest(workflowId, token);
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
    
    
    const getExecutionLogs = useCallback(async (executionId: string) => {
        try{
            setIsLogsLoading(true);

            const token = await getSession();

            const data = await getExecutionsLogsRequest(executionId, token)

            if (data) {
                const logsRecord: Record<string, ExecutionLog> = {}
                data.map(e => logsRecord[e.id] = e);

                runtimeDispatch({
                    type: RuntimeActionType.SET_LOGS,
                    payload: data
                })

                return logsRecord;
            }

            return {}
        }catch (e) {
            console.log(e.message);
        }finally {
            setIsLogsLoading(false);
        }
    }, [runtimeState.logs, runtimeDispatch])

    const fitNode = (node: WorkflowNode) => {
        fitView({ nodes: [{ id: node.id }], duration: 800, padding: 0.05, maxZoom: 1.1 });
    };

    useEffect(() => {
        if (!workflowId || !editorState.graph || !editorState.isDirty) return;

        const persistLocally = async () => {
            await db.drafts.put({
                id: workflowId,
                graph: editorState.graph,
                globalVariables: editorState.globalVariables,
                updatedAt: Date.now(),
                synced: false
            });
        };

        persistLocally();
    }, [editorState.graph, editorState.globalVariables, workflowId]);

    useEffect(() => {
        // 1. Only proceed if we have a local draft that hasn't been synced yet
        if (!localDraft || localDraft.synced) return;

        // 2. Clear previous timer
        if (saveTimeout.current) clearTimeout(saveTimeout.current);

        // 3. Set the "Cloud Sync" timer
        saveTimeout.current = setTimeout(() => {
            console.log("Dexie changed! Syncing to Supabase...");
            saveWorkflowGraph();
        }, 3000);

        return () => {
            if (saveTimeout.current) clearTimeout(saveTimeout.current);
        };
    }, [localDraft]);

    useEffect(() => {
        if (workflowId) loadWorkflow();
    }, [workflowId]);

    return (
        <WorkflowEditorContext.Provider value={{
            editorState,
            workflowEditorDispatch,
            runtimeState,
            runtimeDispatch,
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
            isExecutionsSheetOpen,
            setIsExecutionsSheetOpen,
            isWorkflowInspectorOpen,
            setIsWorkflowInspectorOpen,
            handleSelectTemplate,
            saveWorkflowGraph,
            handleRunWorkflow,
            fitNode,
            isDeploying,
            deployWorkflow,
            deleteDeployment,
            rfNodes,
            rfEdges,
            getExecutionLogs,
            logs,
            setLogs,
            isLogsLoading,
            setIsLogsLoading,
        }}>
            {children}
        </WorkflowEditorContext.Provider>
    );
}