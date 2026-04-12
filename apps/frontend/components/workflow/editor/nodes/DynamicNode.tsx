'use client';

import { NodeProps, Position } from 'reactflow';
import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ContextMenuItem } from '@/components/ui/context-menu';
import { NodeHandle } from './NodeHandle';
import {
    cn,
    getNodeColor,
    getNodeStatusStyles,
    getNodeValidationStyles,
    nodePropsToReactflowNode,
} from '@/lib/utils';
import { Cpu } from 'lucide-react';
import { useWorkflowEditor } from '@/hooks/workflow/useWorkflowEditor';
import { WorkflowEditorActionType } from '@/constants';
import { ContextMenuWrapper } from '@/components/workflow/editor/ContextMenuWrapper';
import { NodeStatusIndicator } from '@/components/workflow/editor/nodes/NodeStatusIndicator';
import { DecisionNodeHandlesRenderer } from '@/components/workflow/editor/nodes/DecisionNodeHandlesRenderer';
import { DynamicNodeToolbar } from '@/components/workflow/editor/nodes/toolbar/DynamicNodeToolbar';
import { useValidation } from '@/hooks/useValidation';
import { nodeRegistry } from '@/registry/nodeRegistry';

export default function DynamicNode(node: NodeProps) {
    const { id, selected, data, type } = node;

    const { editorState, workflowEditorDispatch, setSheetOpen, setSelectedNode } =
        useWorkflowEditor();
    const { getNodeErrors } = useValidation();

    const nodeDef = nodeRegistry[type as keyof typeof nodeRegistry];
    const Icon = nodeDef?.icon || Cpu;

    const nodeError = useMemo(() => getNodeErrors(id), [getNodeErrors, id]);

    const validationStyles = useMemo(
        () => getNodeValidationStyles(nodeError),
        [nodeError]
    );

    const color = getNodeColor(type);
    const status =
        editorState.runtime?.nodeStatus?.[id] ??
        editorState.runtime?.nodeErrors?.[id] ??
        'idle';
    const statusClass = getNodeStatusStyles(status as any);

    const handleMenuClick = (action: string) => {
        switch (action) {
            case 'delete':
                workflowEditorDispatch({
                    type: WorkflowEditorActionType.DELETE_NODE,
                    id,
                });
                break;

            case 'edit':
                setSelectedNode(nodePropsToReactflowNode(node));
                setSheetOpen(true);
                break;
        }
    };

    return (
        <ContextMenuWrapper
            className={'group'}
            trigger={
                <Card
                    onContextMenu={(e) => e.stopPropagation()}
                    className={cn(
                        'group relative flex h-fit w-[200px] flex-col gap-1.5 rounded-2xl border-0 bg-neutral-800/35 p-3 backdrop-blur-sm transition-all',
                        statusClass,
                        nodeError && validationStyles,
                        selected && 'border-neutral-700! border-3!',
                        node.type === 'contextNode' && 'w-[250px]'
                    )}
                >
                    {nodeError && (
                        <div
                            className={cn(
                                'absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-black',
                                nodeError.errors.some((e) => e.level === 'error')
                                    ? 'bg-red-500'
                                    : 'bg-amber-500'
                            )}
                        />
                    )}

                    <DynamicNodeToolbar
                        nodeId={node.id}
                        nodeType={node.type}
                        config={node.data}
                        isVisible={selected}
                        onSettingsClick={() => {
                            setSelectedNode(nodePropsToReactflowNode(node));
                            setSheetOpen(true);
                        }}
                    />

                    <NodeHandle
                        className={cn('-left-[35px]!')}
                        node={node}
                        type="target"
                        position={Position.Left}
                    />

                    <NodeHandle
                        className={cn(
                            '-right-[35px]!',
                            node?.type === 'condition' && 'hidden',
                            node?.type === 'decisionNode' && 'hidden',
                            node.type === 'debug' && 'hidden',
                            node.type === 'contextNode' && 'hidden'
                        )}
                        node={node}
                        type="source"
                        position={Position.Right}
                    />

                    {node?.type === 'decisionNode' && (
                        <DecisionNodeHandlesRenderer node={node} />
                    )}

                    <Card
                        className={cn(
                            'container-full flex h-full flex-col rounded-xl border-0 p-2 transition',
                            'bg-neutral-900/60 group-hover:bg-neutral-800'.
                                selected && 'bg-neutral-700!',
                        )}
                    >
                        <CardContent className="flex flex-grow items-center justify-start gap-2.5 p-0">
                            {/* UPDATED ICON LOGIC: Using Registry for dynamic icons and styles */}
                            <div className={cn("p-2 rounded-lg shrink-0", nodeDef?.styles.bgClass)}>
                                <Icon
                                    size={24}
                                    className={cn('m-0', nodeDef?.styles.iconClass || color.text)}
                                />
                            </div>

                            <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                  {node.type?.replace('_', ' ')}
                </span>
                                <div className={'flex items-center gap-1.5'}>
                  <span className={'text-neutral-500 text-[10px] uppercase font-mono opacity-70'}>
                    {status}
                  </span>
                                    <NodeStatusIndicator status={status as any} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'flex h-full flex-col rounded-xl border-0 p-2 transition',
                            'bg-neutral-900/60 group-hover:bg-neutral-800',
                            selected && 'bg-neutral-700!',
                            node.type === 'contextNode' && 'h-[100px]',
                            node.type === 'decisionNode' && 'h-[50px]',
                            (node.type === 'httpNode' || node.type === 'debug') && 'hidden'
                        )}
                    >
                        <CardContent className="mt-2 flex min-h-[60px] flex-grow items-center justify-start p-0">
              <span className="text-[11px] font-medium text-neutral-300">
                {data?.label || ''}
              </span>
                        </CardContent>
                    </Card>

                    <Card
                        className={cn(
                            'container-full flex h-full flex-col rounded-xl border-0 p-2 transition',
                            'bg-neutral-900/50 group-hover:bg-neutral-800',
                            selected && 'bg-neutral-700!',
                            color.bg
                        )}
                    >
                        <CardContent className="mt-2 flex flex-grow items-center justify-start p-0">
              <span className="text-[11px] font-medium text-neutral-300">
                {node.type || 'Untitled Node'}
              </span>
                        </CardContent>
                    </Card>
                </Card>
            }
        >
            <ContextMenuItem
                className="cursor-pointer"
                onClick={() => handleMenuClick('edit')}
            >
                Edit Configuration
            </ContextMenuItem>

            <ContextMenuItem
                className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500"
                onClick={() => handleMenuClick('delete')}
            >
                Delete Node
            </ContextMenuItem>
        </ContextMenuWrapper>
    );
}