"use client"

import { motion } from "framer-motion"
import { FloatingItem } from "@/constants"
import { Zap } from "lucide-react"
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

export function SystemPanelCard({ item }: { item: FloatingItem }) {
    const Icon = item.icon

    // Define core PCB theme colors for specific interactions
    const powerColor = "rgba(255, 255, 255, 0.9)" // Primary White
    const traceColor = "rgba(255, 255, 255, 0.1)" // Faint White
    const copperColor = "rgba(251, 191, 36, 0.5)" // Amber for mounting rings

    return (
        <motion.div
            whileHover="hover"
            initial="rest"
            animate="rest"
            className="group relative w-[360px] h-[180px] select-none"
        >
            {/* The actual PCB Substrate (angular shape) */}
            <div
                className="absolute inset-0 bg-neutral-950 border border-white/10"
                style={{
                    clipPath: item.shape.clipPath,
                    filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.6))"
                }}
            />

            {/* ENGINEERING LAYER (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                    {/* Unique filter IDs to prevent collisions */}
                    <filter id={`power-glow-${item.title}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 1. Structural Details (Mounting Holes) */}
                <g stroke={copperColor} strokeWidth="0.5" fill="none">
                    <circle cx="15" cy="15" r="4.5" />
                    <circle cx="15" cy="165" r="4.5" />
                    <circle cx="345" cy="15" r="4.5" />
                    <circle cx="345" cy="165" r="4.5" />
                </g>

                {/* 2. Hardware Metadata Text (Fake technical docs) */}
                <g fill="rgba(255,255,255,0.2)" textAnchor="end" className="text-[7px] font-mono tracking-wider">
                    <text x="330" y="25">MODEL: LAZARUS_v1</text>
                    <text x="330" y="35">LAYER: {item.side === "left" ? "TOP_SI" : "BOT_SI"}</text>
                    <text x="330" y="155">PROTO_UNIT</text>
                </g>

                {/* 3. Base PCB Traces (Dormant State) */}
                <path
                    d={item.shape.path}
                    stroke={traceColor}
                    strokeWidth="0.75"
                    fill="none"
                    className="transition-opacity group-hover:opacity-100 opacity-80"
                />

                {/* 4. Active Power-On Trace (Animated) */}
                <motion.path
                    d={item.shape.path}
                    stroke={powerColor}
                    strokeWidth="1.25"
                    fill="none"
                    pathLength={1}
                    variants={{
                        rest: { strokeDashoffset: 1, opacity: 0 },
                        hover: { strokeDashoffset: 0, opacity: 1 }
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                        strokeDasharray: 1,
                        filter: `url(#power-glow-${item.title})`
                    }}
                />
            </svg>

            {/* CONTENT LAYER */}
            <div className="relative z-20 h-full flex flex-col justify-between p-6 pl-10">

                {/* Visual Connector Pins Indicator */}
                <div className={cn(
                    "absolute top-0 bottom-0 w-1 flex flex-col justify-center gap-1.5 opacity-50",
                    item.side === "left" ? "-right-px" : "-left-px"
                )}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="w-1 h-px bg-amber-600/60" />
                    ))}
                </div>

                {/* TOP BLOCK (Module Info) */}
                <div className="flex items-start gap-4">
                    {/* Port Box */}
                    <div className="flex flex-col items-center gap-1 p-2 border border-white/10 bg-white/5 rounded-md mt-1">
                        <span className="text-[7px] font-mono text-neutral-600 uppercase">Input</span>
                        <Icon size={14} className="text-white/70 group-hover:text-white transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{item.title}</span>
                            <Zap className="w-3 h-3 text-amber-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[9px] text-neutral-500 leading-normal max-w-[280px]">
                            {item.desc}
                        </span>
                    </div>
                </div>

                {/* BOTTOM BLOCK (Module ID) */}
                <div className="flex items-center gap-2">
                    <Badge className="font-mono text-[8px] tracking-widest bg-zinc-900 border border-zinc-800 text-neutral-500 uppercase rounded">
                        MOD::LAZ_{item.title.replace(/\s+/g, '_').toUpperCase()}
                    </Badge>
                    {item.shape.clipPath.includes('polygon') && (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-[0_0_5px_1px_rgba(16,185,129,0.3)] group-hover:animate-pulse" />
                    )}
                </div>
            </div>
        </motion.div>
    )
}