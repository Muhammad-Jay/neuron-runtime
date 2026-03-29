"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SectionType } from "./HeroSection"

const TEXT = {
    intro: {
        title: "Neuron",
        subtitle: "Build intelligent workflows that think and act"
    },
    features: {
        title: "Design Visually",
        subtitle: "Create workflows with powerful nodes"
    },
    capabilities: {
        title: "Execute Intelligently",
        subtitle: "Dynamic, real-time decision systems"
    },
    demos: {
        title: "See It In Action",
        subtitle: "From idea to execution instantly"
    }
}

export function HeroOverlay({ section }: { section: SectionType }) {
    const content = TEXT[section];

    return (
        <div className="absolute top-24 left-0 right-0 z-20 pointer-events-none">
            <AnimatePresence mode="wait">
                <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-4xl md:text-6xl font-light tracking-[-0.04em] text-foreground">
                        {content.title}
                    </h1>
                    <div className="h-[1px] w-12 bg-white/20 my-6" />
                    <p className="text-sm font-medium text-neutral-500 uppercase tracking-[0.3em]">
                        {content.subtitle}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}