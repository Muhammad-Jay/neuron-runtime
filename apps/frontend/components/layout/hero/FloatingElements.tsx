"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SectionType } from "./HeroSection"
import {Activity, GitBranch, Layers, Terminal, Workflow, Cpu} from "lucide-react";
import {cn} from "@/lib/utils";
import {memo} from "react";

type Side = "left" | "right"


const DATA = {
    intro: [],
    features: [
        {
            title: "Neural Engine",
            icon: Cpu,
            desc: "Autonomous inference units capable of executing high-precision instruction payloads. Optimized for low-latency decision cycles and state-aware processing."
        },
        {
            title: "Mesh Gateway",
            icon: Workflow,
            desc: "Bi-directional integration bridge designed to unify fragmented APIs into a single logical fabric. Supports authenticated webhook propagation and data normalization."
        }
    ],
    capabilities: [
        {
            title: "Pulse Execution",
            icon: Activity,
            desc: "Real-time event stream orchestration with sub-15ms propagation. Monitor every heartbeat of your workflow with detailed telemetry and granular state tracking."
        },
        {
            title: "Logic Gates",
            icon: GitBranch,
            desc: "Multi-layered conditional branching utilizing intent-analysis to route complex data structures. Define sophisticated exit-criteria for every execution step."
        }
    ],
    demos: [
        {
            title: "Lazarus Sync",
            icon: Layers,
            desc: "Deep-layer infrastructure control for containerized environments. Automatically provision and scale Podman instances based on real-time computational demand."
        },
        {
            title: "Kernel Bridge",
            icon: Terminal,
            desc: "A secure, sandboxed local runtime enabling the AI to interface directly with system-level commands, file operations, and native environment variables."
        }
    ]
}

export const FloatingElements = memo(function FloatingElements({
                                     side,
                                     section,
                                     cardRefs
                                 }: {
    side: Side,
    section: SectionType,
    cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
    const items = DATA[section] || [];

    return (
        <div
            className={cn(
                "absolute top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 w-[400px] pointer-events-auto",
                side === "left"
                    ? "right-[110%] items-end text-right"
                    : "left-[110%] items-start text-left"
            )}
        >
            <AnimatePresence mode="wait">
                {items.map((item, i) => {
                    const Icon = item.icon;
                    const refIndex = side === "left" ? i : i + 2;
                    return (
                        <motion.div
                            key={item.title}
                            ref={(el) => { cardRefs.current[refIndex] = el }}
                            initial={{
                                opacity: 0,
                                x: side === "left" ? -60 : 60,
                                filter: "blur(10px)"
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                filter: "blur(0px)"
                            }}
                            exit={{
                                opacity: 0,
                                x: side === "left" ? -60 : 60,
                                filter: "blur(10px)"
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 20,
                                delay: i * 0.1
                            }}
                            className="relative group w-[340px] bg-white/[0.02] border border-white/5 rounded-2xl p-5 backdrop-blur-md shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white/5 border border-white/10 rounded-lg">
                                    {Icon && <Icon size={14} className="text-primary" />}
                                </div>
                                <p className="text-[10px] font-black text-white uppercase tracking-widest">
                                    {item.title}
                                </p>
                            </div>
                            <p className="text-[11px] text-neutral-500 leading-relaxed">
                                {item.desc}
                            </p>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    )
})