"use client";

import {
    addEdge,
    applyEdgeChanges,
    applyNodeChanges,
    Background,
    BackgroundVariant,
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useOnSelectionChange,
} from "reactflow";
import {useCallback, useEffect, useState} from "react";
import "reactflow/dist/style.css";
import {useWorkflowEditor} from "@/hooks/workflow/useWorkflowEditor";
import {WorkflowEditorActionType} from "@/constants";
import {EmptyGraphMenu} from "@/components/workflow/editor/EmptyGraphContextMenu";
import {NodeTemplateSheet} from "@/components/workflow/editor/NodeTemplateSheet";
import DynamicNode from "@/components/workflow/editor/nodes/DynamicNode";
import {HttpRequestNodeConfigSheet} from "@/components/workflow/editor/sheet/HttpNodeConfigSheet";
import {DebugNodeConfigSheet} from "@/components/workflow/editor/sheet/DebugNodeSheet";
import {TriggerNodeConfigSheet} from "@/components/workflow/editor/sheet/TriggerNodeSheet";
import {Skeleton} from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {PanelWrapper} from "@/components/workflow/editor/Panel/PanelWrapper";
import {Button} from "@/components/ui/button";
import {LoaderCircle, Play, Rocket, Variable} from "lucide-react";
import {SheetWrapper} from "@/components/workflow/editor/SheetWrapper";
import {JsonRenderer} from "@/components/JsonRenederer";
import {ConditionNodeConfigSheet} from "@/components/workflow/editor/sheet/ConditionNodeConfigSheet";
import {TransformNodeConfigSheet} from "@/components/workflow/editor/sheet/TransformNodeConfigSheet";
import {NodesInspector} from "@/components/workflow/editor/sheet/NodesInspector";
import {LLMNodeConfigSheet} from "@/components/workflow/editor/sheet/LlmConfigSheet";
import {ExecutionTrace} from "@/components/workflow/editor/ExecutionTrace";
import { DecisionNodeConfigSheet } from "./sheet/DecisionNodeConfigSheet";
import {IntegrationNodeConfigSheet} from "@/components/workflow/editor/sheet/IntegrationNodeConfigSheet";
import {GlobalVariablesSheet} from "@/components/workflow/editor/sheet/GlobalVariableSheet";
import {EditorLoader} from "@/components/workflow/editor/EditorLoader";
import {OutputNodeConfigSheet} from "@/components/workflow/editor/sheet/OutputNodeConfigSheet";
import {Separator} from "@/components/ui/separator";
import {DeployWorkflowPanel} from "@/components/workflow/editor/dialog/DeployWorkflowDialog";
import {RespondNodeConfigSheet} from "@/components/workflow/editor/sheet/RespondNodeConfigSheet";
import {ContextNodeConfigSheet} from "@/components/workflow/editor/sheet/ContextNodeConfigSheet";

// --------------------------------------------
// Component
// --------------------------------------------

const nodeTypes = {
    trigger: DynamicNode,
    httpNode: DynamicNode,
    debug: DynamicNode,
    condition: DynamicNode,
    transform: DynamicNode,
    llmNode: DynamicNode,
    decisionNode: DynamicNode,
    integrationNode: DynamicNode,
    outputNode: DynamicNode,
    respondNode: DynamicNode,
    contextNode: DynamicNode,
};

// const edgeTypes = {
//     workflowEdge: WorkflowEdge,
// }

export function Editor() {

    const {
        editorState,
        workflowEditorDispatch,
        setSelectedNode,
        handleSelectTemplate,
        selectedNode,
        isSheetOpen,
        setIsSheetOpen,
        sheetOpen,
        setSheetOpen,
        setIsEditorPanelOpen,
        isWorkflowLoading,
        handleRunWorkflow,
        isRunning,
        setIsGlobalVariableSheetOpen,
        isDeployWorkflowDialogOpen,
        setIsDeployWorkflowDialogOpen,
    } = useWorkflowEditor();

    const [open, setOpen] = useState(false);
    // -------------------------------
    // ReactFlow UI State
    // -------------------------------

    const [graphNodes, setGraphNodes, onNodesChange] = useNodesState([]);
    const [graphEdges, setGraphEdges, onEdgesChange] = useEdgesState([]);

    // --------------------------------------------
    // 1️⃣ Sync reducer → ReactFlow (ON LOAD / STATE CHANGE)
    // --------------------------------------------

    useEffect(() => {

        const isActive = (id: string) => editorState?.runtime?.activeEdges?.[id];

        const rfNodes: Node[] = editorState.graph.nodes.map((node) => ({
            id: node.id,
            type: node.type,
            position: node.position,
            data: {
                config: node.config,
            },
            selected: selectedNode ? selectedNode?.id === node.id : false,
        }));

        const rfEdges: Edge[] = editorState.graph.edges.map((edge) => {
            const active = isActive(edge.id);

            return {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: "default",
                animated: active,
                style: {
                    stroke: active ? "#00cf00" : "#4b5563",
                    strokeWidth: active ? 4 : 2,
                    transition: 'stroke 0.3s, stroke-width 0.3s',
                },
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
            };
        });

        setGraphNodes(rfNodes);
        setGraphEdges(rfEdges);

    }, [editorState.graph, editorState.runtime, setGraphNodes, setGraphEdges]);

    useOnSelectionChange({
        onChange: ({nodes: selectedNodes}) => {
            if (!selectedNodes || selectedNodes.length === 0) {
                setSelectedNode(null);
                return;
            }
            setSelectedNode(selectedNodes[0]);
        }
    });



    // --------------------------------------------
    // 2️⃣ Sync NODE POSITION back → reducer
    // (ONLY when drag stops — best practice)
    // --------------------------------------------

    const onNodeDragStop = useCallback(
        (_: any, node: Node) => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE_POSITION,
                id: node.id,
                position: node.position,
            });
        },
        [workflowEditorDispatch]
    );

    // --------------------------------------------
    // 3️⃣ Handle edge connect → reducer
    // --------------------------------------------

    const onConnect = useCallback(
        (connection: Connection) => {
            const newEdge: Edge = {
                ...connection,
                id: crypto.randomUUID(),
            };

            setGraphEdges((eds) => addEdge(newEdge, eds));

            workflowEditorDispatch({
                type: WorkflowEditorActionType.ADD_EDGE,
                payload: {
                    id: newEdge.id,
                    source: newEdge.source!,
                    target: newEdge.target!,
                    sourceHandle: newEdge.sourceHandle,
                    targetHandle: newEdge.targetHandle,
                },
            });
        },
        [workflowEditorDispatch, setGraphEdges]
    );

    // --------------------------------------------
    // 4️⃣ Handle node delete
    // --------------------------------------------

    const handleNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setGraphNodes((nds) => applyNodeChanges(changes, nds));

            changes.forEach((change) => {
                if (change.type === "remove") {
                    workflowEditorDispatch({
                        type: WorkflowEditorActionType.DELETE_NODE,
                        id: change.id,
                    });
                }
            });
        },
        [workflowEditorDispatch, setGraphNodes]
    );

    // Handle edge delete

    const handleEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setGraphEdges((eds) => applyEdgeChanges(changes, eds));

            changes.forEach((change) => {
                if (change.type === "remove") {
                    workflowEditorDispatch({
                        type: WorkflowEditorActionType.DELETE_EDGE,
                        id: change.id,
                    });
                }
            });
        },
        [workflowEditorDispatch, setGraphEdges]
    );

    const handleNodeDoubleClick = (event, node: Node) => {
        setSelectedNode(node);
        setSheetOpen(true);
    }

    // Handle Add new Node
    const handleAddNode = () => {
        setIsSheetOpen(true)
    }

    const openDialog = () => setIsDeployWorkflowDialogOpen(true);

    // --------------------------------------------
    // Render
    // --------------------------------------------

    if (isWorkflowLoading){
        return (
            <EditorLoader/>
        )
    }

    return (
        <ReactFlow
            className={' container-full'}
            nodes={graphNodes}
            edges={graphEdges}
            nodeTypes={nodeTypes}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            onNodeDoubleClick={handleNodeDoubleClick}
            fitView
        >
            <Background color={"#121212"} gap={80} variant={BackgroundVariant.Cross} size={18}/>

            {/* Top Left Controls */}
            <PanelWrapper position="top-left" width="w-[40px]" className={"h-fit mt-[5%]!"}>
                <div className="flex flex-col gap-2">
                    <Button
                        onClick={() => setIsEditorPanelOpen(true)}
                        variant="outline" size="xs" className="h-8 w-full rounded-sm p-2 bg-neutral-800/50 border-neutral-700">
                        A
                    </Button>
                    <Button
                        onClick={handleRunWorkflow}
                        disabled={isRunning}
                        variant={"outline"} size="xs" className="h-8 w-full bg-neutral-800/50 border-neutral-700 rounded-sm px-4 text-xs p-2 between gap-1.5 text-black">
                        <Play size={'11'} className={'text-black font-semibold'}/>
                    </Button>
                </div>
            </PanelWrapper>

            <NodesInspector/>

            {graphNodes.length === 0 && (
                <Panel position="top-center" className={'container-fit canter top-[40%]!'}>
                    <EmptyGraphMenu onAddNode={handleAddNode} />
                </Panel>
            )}
            <NodeTemplateSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onSelectTemplate={handleSelectTemplate}
            />

            <GlobalVariablesSheet/>

            <DeployWorkflowPanel
                isOpen={isDeployWorkflowDialogOpen}
                onOpenChange={setIsDeployWorkflowDialogOpen}
                workflowName={editorState.workflow?.name}
            />

            {selectedNode && sheetOpen && selectedNode.type === "trigger" && (
                <TriggerNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "httpNode" && (
                <HttpRequestNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "debug" && (
                <DebugNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "condition" && (
                <ConditionNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "transform" && (
                <TransformNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "llmNode" && (
                <LLMNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "decisionNode" && (
                <DecisionNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "integrationNode" && (
                <IntegrationNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "outputNode" && (
                <OutputNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "respondNode" && (
                <RespondNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }
            {selectedNode && sheetOpen && selectedNode.type === "contextNode" && (
                <ContextNodeConfigSheet node={selectedNode} open={sheetOpen} onOpen={setSheetOpen}/>
            ) }

            <ExecutionTrace
                className={"w-[700px]! h-full! p-2.5!"}
                open={open} onOpenChange={setOpen}/>


            <PanelWrapper position="top-left"  width="w-48">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-xs text-neutral-500">Nodes:</span>
                        <span className="text-xs text-primary">{graphNodes.length}</span>
                    </div>
                </div>
            </PanelWrapper>

            {/* Example 2: Bottom Right Controls */}
            <PanelWrapper position="top-right" width="w-auto">
                <div className="flex gap-2">
                    <Button
                        onClick={() => setOpen(true)}
                        variant="outline" size="xs" className="h-8 rounded-sm p-2 bg-neutral-800/50 border-neutral-700">
                        Auto-Layout
                    </Button>

                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setIsGlobalVariableSheetOpen(true)}
                        className="bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800 text-[10px] font-bold uppercase tracking-widest h-9 px-3 gap-2 backdrop-blur-md"
                    >
                        <Variable size={"12"} className="text-xs text-primary" />
                        Variables
                    </Button>

                    <Button
                        onClick={handleRunWorkflow}
                        disabled={isRunning}
                        variant={"default"} size="xs" className="h-8 w-fit rounded-sm px-4 text-xs p-2 between gap-1.5 text-black">
                        <Play size={'12'} className={'text-black font-semibold'}/>
                        Run
                    </Button>

                    <Button
                        onClick={() => setIsDeployWorkflowDialogOpen(true)}
                        // disabled={isRunning}
                        variant={"default"} size="xs" className="h-8 w-fit rounded-sm px-4 text-xs p-2 between gap-1.5 text-black">
                        <Rocket size={'12'} className={'text-black font-semibold'}/>
                        Deploy
                    </Button>
                </div>
            </PanelWrapper>


            {/* Updating indicator */}
            <PanelWrapper position="bottom-left" className={"bg-transparent! border-none!"} width="w-auto">
                {isRunning && (
                    <Badge variant="outline">
                        <Spinner data-icon="inline-start" />
                        Updating
                    </Badge>
                )}
            </PanelWrapper>
        </ReactFlow>
    );
}