"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SectionType } from "./HeroSection"

// Dynamic mapping based on SectionType
const SECTION_CONTENT: Record<SectionType, { label: string; desc: string }> = {
    intro: {
        label: "NEURON",
        desc: "Architecture of Intelligence"
    },
    any: {
        label: "NEURON",
        desc: "Seamless Execution"
    },
    features: {
        label: "FEATURES",
        desc: "Visual Logical Design"
    },
    capabilities: {
        label: "CAPABILITIES",
        desc: "Autonomous Power"
    },
    demos: {
        label: "DEMONSTRATION",
        desc: "The Future Revealed"
    }
}

export function HeroOverlay({ section }: { section: SectionType }) {
    const { label, desc } = SECTION_CONTENT[section] || SECTION_CONTENT.intro;

    return (
        <div className="absolute top-24 left-0 right-0 z-50 pointer-events-none select-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={section}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="flex flex-col items-center"
                >
                    {/* 1. THE TITLE: Modern, Gradient, No pure white */}
                    <motion.h1
                        variants={{
                            initial: { opacity: 0, y: 30, filter: "blur(20px)" },
                            animate: { opacity: 1, y: 0, filter: "blur(0px)" },
                            exit: { opacity: 0, y: -30, filter: "blur(20px)" }
                        }}
                        transition={{
                            duration: 1.4,
                            ease: [0.19, 1, 0.22, 1]
                        }}
                        className="pb-2 text-6xl md:text-8xl font-medium tracking-tighter bg-gradient-to-b from-foreground via-foreground/90 to-foreground/40 bg-clip-text text-transparent"
                    >
                        {label}
                    </motion.h1>

                    {/* 2. THE DIVIDER: Minimalist light point */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-[2px] h-12 bg-gradient-to-b from-foreground/40 to-transparent my-6"
                    />

                    {/* 3. THE SUBTITLE: Subtle, wide, elegant */}
                    <motion.p
                        variants={{
                            initial: { opacity: 0, letterSpacing: "0.2em" },
                            animate: { opacity: 1, letterSpacing: "0.6em" },
                            exit: { opacity: 0, letterSpacing: "0.2em" }
                        }}
                        transition={{
                            duration: 1.8,
                            ease: [0.19, 1, 0.22, 1],
                            delay: 0.2
                        }}
                        className="text-[10px] md:text-[11px] font-light text-neutral-400 uppercase text-center"
                    >
                        {desc}
                    </motion.p>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}