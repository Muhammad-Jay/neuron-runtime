"use client"

import React, {ReactNode} from 'react'
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from 'framer-motion'
import {ShieldCheck, X} from 'lucide-react'

type PanelPosition =
    | 'Top Right' | 'Bottom Right' | 'Top Left' | 'Bottom Left'
    | 'Bottom Center' | 'Top Center' | 'Left Center' | 'Right Center'

interface InspectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title?: string
    icon?: ReactNode | any
    description?: string
    tabs?: React.ReactNode // Slot for your tab buttons
    children: React.ReactNode
    position?: PanelPosition
    className?: string
    width?: string
}

const positionClasses: Record<PanelPosition, string> = {
    'Top Left': 'top-[30px] left-[65px]',
    'Bottom Left': 'bottom-4 left-4',
    'Top Right': 'top-[30px] right-[70px]',
    'Bottom Right': 'bottom-4 right-4',
    'Top Center': 'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2',
    'Bottom Center': 'bottom-4 left-1/2 -translate-x-1/2',
    'Left Center': 'left-[110px] top-1/2 -translate-y-1/2',
    'Right Center': 'right-4 top-[80px] ',
}

export function EditorPanel({
                                     open,
    icon,
                                onOpenChange,
                                     title,
                                     description,
                                     tabs,
                                     children,
                                     position = 'Top Right',
                                     className,
                                     width = 'w-[380px]'
                                 }: InspectorProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, x: position.includes('Right') ? 20 : -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                    className={cn(
                        "fixed z-60 flex w-[300px] h-[80dvh] flex-col overflow-hidden",
                        "border border-neutral-800 bg-neutral-900/60 backdrop-blur-2xl shadow-2xl rounded-xl",
                        positionClasses[position],
                        width,
                        className
                    )}
                >
                    {/* Header Section */}
                    <header className="p-4 border-b border-neutral-800/50 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {icon && (
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-indigo-400">
                                        {icon}
                                    </div>
                                )}
                                <h3 className="text-sm font-semibold text-neutral-100 tracking-tight">
                                    {title || 'Inspector'}
                                </h3>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-500 hover:text-neutral-200 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {description && (
                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                                {description}
                            </p>
                        )}
                    </header>

                    {/* Tabs Slot */}
                    {tabs && (
                        <div className="px-4 py-2 bg-neutral-900/30 border-b border-neutral-800/50 flex gap-2">
                            {tabs}
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 container-full" id={"hide-scrollbar"}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}