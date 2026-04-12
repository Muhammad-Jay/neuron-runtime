'use client';

import React from 'react';
import { NodeToolbar, Position } from 'reactflow';
import { Trash2, Copy, Play, Settings, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useWorkflowEditor } from '@/hooks/workflow/useWorkflowEditor';
import { WorkflowEditorActionType } from '@/constants';
import { NodePreview } from '@/components/workflow/editor/nodes/NodePreview';

interface JaguarNodeToolbarProps {
  nodeId: string;
  nodeType?: string;
  isVisible?: boolean;
  config: any;
  onSettingsClick?: () => void;
}

export function DynamicNodeToolbar({
  nodeId,
  nodeType,
  config,
  isVisible,
  onSettingsClick,
}: JaguarNodeToolbarProps) {
  const { workflowEditorDispatch, editorState } = useWorkflowEditor();

  const status = editorState.runtime?.nodeStatus?.[nodeId] ?? 'idle';
  const output =
    editorState.runtime.nodeOutputs?.[nodeId] ||
    editorState.runtime.nodeErrors?.[nodeId];

  const handleDelete = () => {
    workflowEditorDispatch({
      type: WorkflowEditorActionType.DELETE_NODE,
      id: nodeId,
    });
  };

  const handleDuplicate = () => {
    // workflowEditorDispatch({
    //     type: WorkflowEditorActionType.DUPLICATE_NODE,
    //     id: nodeId
    // });
  };

  return (
    <NodeToolbar
      isVisible={isVisible}
      position={Position.Top}
      offset={12}
      className="z-50"
    >
      <TooltipProvider delayDuration={0}>
        <div
          className={cn(
            'flex items-center gap-3',
            'rounded-md border border-neutral-800 bg-neutral-700/25 p-2 backdrop-blur-md',
            'animate-in fade-in zoom-in-95 duration-200'
          )}
        >
          <div className="mx-1 h-4 w-px bg-neutral-800" />

          {/* SETTINGS ACTION */}
          <ToolbarButton
            onClick={onSettingsClick}
            icon={<Settings className="text-xs!" />}
            label="Configure"
          />

          {/* DUPLICATE ACTION */}
          <ToolbarButton
            onClick={handleDuplicate}
            icon={<Copy className="text-xs!" />}
            label="Duplicate"
          />

          {/* DELETE ACTION */}
          {/*<ToolbarButton*/}
          {/*  onClick={handleDelete}*/}
          {/*  icon={<Trash2 className="text-xs! text-red-400" />}*/}
          {/*  label="Delete"*/}
          {/*  className="hover:bg-red-500/10"*/}
          {/*/>*/}

          {/* Node Preview */}
          <NodePreview
            nodeId={nodeId}
            output={output}
            nodeType={nodeType}
            config={config}
            nodeData={output}
            status={status}
            className={cn('transition-200 hidden', isVisible && 'block')}
          />

          <div className="mx-1 h-4 w-px bg-neutral-800" />

          {/* MORE ACTION */}
          <ToolbarButton
            icon={<MoreHorizontal className="text-xs!" />}
            label="More Actions"
          />
        </div>
      </TooltipProvider>
    </NodeToolbar>
  );
}

// Internal Helper for cleaner code
function ToolbarButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className={cn(
            'h-5 w-5 rounded-lg text-xs! text-neutral-400 transition-all hover:text-white',
            className
          )}
        >
          {icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="border-neutral-800 bg-neutral-950 px-2 py-1 text-[10px] font-bold tracking-widest text-white! uppercase"
      >
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
