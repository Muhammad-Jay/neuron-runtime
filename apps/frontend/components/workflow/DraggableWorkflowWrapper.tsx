'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

interface DraggableWorkflowWrapperProps {
    id: string;
    workflow: any; // Use WorkflowType
    children: React.ReactNode;
}

export const DraggableWorkflowWrapper = ({
                                             id,
                                             workflow,
                                             children
                                         }: DraggableWorkflowWrapperProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: id,
        data: {
            workflow,
        },
    });

    // Apply the transformation smoothly while dragging
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: isDragging ? 'none' : undefined,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "relative z-0 transition-transform duration-200",
                isDragging && "z-50 cursor-grabbing scale-[1.02] opacity-40 grayscale-[0.5]"
            )}
        >
            {children}
        </div>
    );
};