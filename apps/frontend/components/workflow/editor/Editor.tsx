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
import { debounce } from 'lodash';
import {useCallback, useEffect, useMemo, useState} from "react";
// @ts-ignore
import "reactflow/dist/style.css";
import {useWorkflowEditor} from "@/hooks/workflow/useWorkflowEditor";
import {WorkflowEditorActionType} from "@/constants";
import {EmptyGraphMenu} from "@/components/workflow/editor/EmptyGraphContextMenu";
import {NodeTemplateSheet} from "@/components/workflow/editor/NodeTemplateSheet";
import DynamicNode from "@/components/workflow/editor/nodes/DynamicNode";
import {HttpRequestNodeConfigSheet} from "@/components/workflow/editor/sheet/HttpNodeConfigSheet";
import {DebugNodeConfigSheet} from "@/components/workflow/editor/sheet/DebugNodeSheet";
import {TriggerNodeConfigSheet} from "@/components/workflow/editor/sheet/TriggerNodeSheet";
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
import {DeployWorkflowPanel} from "@/components/workflow/editor/dialog/DeployWorkflowDialog";
import {RespondNodeConfigSheet} from "@/components/workflow/editor/sheet/RespondNodeConfigSheet";
import {ContextNodeConfigSheet} from "@/components/workflow/editor/sheet/ContextNodeConfigSheet";
import TriggerNode from "@/components/workflow/editor/nodes/TriggerNode";
import {ExecutionHistorySheet} from "@/components/workflow/editor/executions/ExecutionHistorySheet";
import {EditorTopMenu} from "@/components/workflow/editor/menu/EditorTopMenu";
import {EditorLeftMenu} from "@/components/workflow/editor/menu/EditorLeftMenu";
import {EditorRightMenu} from "@/components/workflow/editor/menu/EditorRightMenu";
import {EditorBottomMenu} from "@/components/workflow/editor/menu/EditorBottomMenu";
import {WorkflowInspector} from "@/components/workflow/editor/WorkflowInspector";

// --------------------------------------------
// Component
// --------------------------------------------

const nodeTypes = {
    trigger: TriggerNode,
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

const snapGrid: [number, number] = [80, 80];

export function Editor() {

    const {
        editorState,
        workflowEditorDispatch,
        rfNodes,
        rfEdges,
        setSelectedNode,
        handleSelectTemplate,
        selectedNode,
        isSheetOpen,
        setIsSheetOpen,
        sheetOpen,
        setSheetOpen,
        isWorkflowLoading,
        isDeployWorkflowDialogOpen,
        setIsDeployWorkflowDialogOpen,
    } = useWorkflowEditor();

    const [open, setOpen] = useState(false);
    // -------------------------------
    // ReactFlow UI State
    // -------------------------------

    const [graphNodes, setGraphNodes, onNodesChange] = useNodesState([]);
    const [graphEdges, setGraphEdges, onEdgesChange] = useEdgesState([]);

    useOnSelectionChange({
        onChange: ({nodes: selectedNodes}) => {
            if (!selectedNodes || selectedNodes.length === 0) {
                setSelectedNode(null);
                return;
            }
            setSelectedNode(selectedNodes[0]);
        }
    });


    useEffect(() => {
        if (!rfNodes) return;

        const timer = setTimeout(() => {
            setGraphNodes(rfNodes);
            setGraphEdges(rfEdges);
        }, 200)

        return () => clearTimeout(timer)
    }, [rfNodes, rfEdges, setGraphNodes, setGraphEdges]);


    // --------------------------------------------
    // 2️⃣ Sync NODE POSITION back → reducer
    // (ONLY when drag stops — best practice)
    // --------------------------------------------

    const debouncedUpdatePosition = useMemo(
        () => debounce((id, pos) => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.UPDATE_NODE_POSITION,
                id,
                position: pos
            });
        }, 100),
        [workflowEditorDispatch]
    );

    const onNodeDragStop = useCallback(
        (_: any, node: Node) => {
            debouncedUpdatePosition(node.id, node.position)
        },
        [workflowEditorDispatch, debouncedUpdatePosition]
    );

    // --------------------------------------------
    // 3️⃣ Handle edge connect → reducer
    // --------------------------------------------

    const debouncedAddEdge = useMemo(
        () => debounce((edge) => {
            workflowEditorDispatch({
                type: WorkflowEditorActionType.ADD_EDGE,
                payload: edge,
            });
        }, 200),
        [workflowEditorDispatch]
    );

    const onConnect = useCallback(
        (connection: Connection) => {
            const newEdge: Edge = { ...connection, id: crypto.randomUUID() };
            setGraphEdges((eds) => addEdge(newEdge, eds));

            debouncedAddEdge({
                id: newEdge.id,
                source: newEdge.source!,
                target: newEdge.target!,
                sourceHandle: newEdge.sourceHandle,
                targetHandle: newEdge.targetHandle,
            });
        },

        [setGraphEdges, debouncedAddEdge]
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
            snapToGrid={true}
            snapGrid={snapGrid}
            minZoom={0.12}
            maxZoom={2}
        >
            <Background color={"#121212"} gap={80} variant={BackgroundVariant.Cross} size={18}/>

            <EditorTopMenu />
            <EditorLeftMenu />
            <EditorRightMenu />
            <EditorBottomMenu />

            <NodesInspector/>
            <WorkflowInspector/>

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

            <ExecutionHistorySheet/>

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

        </ReactFlow>
    );
}