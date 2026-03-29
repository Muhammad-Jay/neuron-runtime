"use client"

import { motion } from "framer-motion"
import {useRef, useState, memo, useCallback} from "react"
import { HeroSphere } from "./HeroSphere"
import { FloatingElements } from "./FloatingElements"
import { HeroOverlay } from "./HeroOverlay"
import { FabricReveal } from "./TerminalReveal"
import { AppButton } from "@/components/CustomButton"
import { Rocket, ArrowRight } from "lucide-react"
import { useHeroBridge } from "@/hooks/use-hero-bridge"

const SECTIONS = ["intro", "features", "capabilities", "demos"] as const
export type SectionType = typeof SECTIONS[number]

export const HeroSection = memo(function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const [ballPos, setBallPos] = useState({ x: 0, y: 0 })

    const { activeSection, scrollYProgress, transforms } = useHeroBridge(containerRef)

    const handleBallUpdate = useCallback((pos: { x: number, y: number }) => {
        setBallPos(pos)
    }, [])

    return (
        <div ref={containerRef} className="relative h-[600vh] bg-black text-white overflow-clip">

            {/* LAYER 1: THE FLOATING HERO */}
            <motion.div
                style={transforms.heroExit}
                className="sticky top-0 h-screen w-full flex items-center justify-center z-20 pointer-events-none"
            >
                {/* Background radial glow */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_50%)]" />

                {/* Status Overlays */}
                <motion.div style={{ opacity: scrollYProgress.get() > 0.12 ? 1 : 0 }} className="transition-opacity duration-500">
                    <HeroOverlay section={activeSection} />
                </motion.div>

                <div className="relative z-10 w-full h-full flex items-center pointer-events-none">

                    {/* LEFT CONTENT: HEADLINE */}
                    <div className="w-full max-w-7xl mx-auto px-10 flex items-center h-full">
                        <motion.div
                            style={transforms.text}
                            className="w-1/2 flex flex-col gap-10 pr-10 pointer-events-auto"
                        >
                            <div className="space-y-6">
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                                    <div className="w-8 h-[1px] bg-primary" />
                                    <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Neuron v3.0</span>
                                </motion.div>
                                <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85]">
                                    BEYOND <br/> <span className="text-neutral-600 italic">CODE.</span>
                                </h1>
                                <p className="text-neutral-500 max-w-sm text-sm leading-relaxed font-medium">
                                    Autonomous backend orchestration kernel. <br/>
                                    Build visually, deploy instantly.
                                </p>
                            </div>
                            <div className="flex items-center gap-5">
                                <AppButton label="Initialize" icon={<Rocket size={14} />} className="bg-white text-black px-10 py-7 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-transform" />
                                <AppButton label="Docs" variant="ghost" icon={<ArrowRight size={14} />} className="text-neutral-400 px-10 py-7 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:text-white" />
                            </div>
                        </motion.div>
                    </div>

                    {/* SPHERE: ABSOLUTE CENTER-TARGETED */}
                    <motion.div
                        style={transforms.sphere}
                        className="absolute top-0 h-full flex items-center justify-center z-30 pointer-events-none"
                    >
                        <div className="relative w-[420px] h-[420px] flex items-center justify-center">
                            <div className="absolute w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full z-0" />

                            <div className="relative z-10">
                                <HeroSphere section={activeSection} onBallUpdate={handleBallUpdate} />
                            </div>

                            <FloatingElements side="left" section={activeSection} cardRefs={cardRefs} />
                            <FloatingElements side="right" section={activeSection} cardRefs={cardRefs} />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* LAYER 2: THE REVEALED KERNEL */}
            <motion.div
                style={transforms.reveal}
                className="sticky top-0 h-screen w-full flex flex-col items-center justify-center z-10 bg-[#050505]"
            >
                <div className="absolute inset-0 opacity-[0.03]"
                     style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                         backgroundSize: '50px 50px' }} />
                <FabricReveal isActive={scrollYProgress.get() > 0.75} />
            </motion.div>
        </div>
    )
})