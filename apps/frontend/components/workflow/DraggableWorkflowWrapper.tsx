'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { WorkflowType } from "@neuron/shared";

interface DraggableWorkflowWrapperProps {
    id: string;
    workflow: WorkflowType;
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

    /**
     * Inline styles for dnd-kit transformation.
     * translate3d for hardware acceleration.
     */
    const style: React.CSSProperties | undefined = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        // Disable transitions while dragging to prevent "laggy" following
        transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
            zIndex: 999,
        position: 'relative',
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            // Pointer-events: none on the wrapper during drag can help
            // the 'over' detection on drop targets
            className={cn(
                "relative group touch-none",
                isDragging && "cursor-grabbing scale-[1.05] opacity-50 grayscale-[0.5] shadow-2xl"
            )}
        >
            {children}
        </div>
    );
};