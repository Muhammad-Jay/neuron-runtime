"use client"

import { useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion"
import { useState, RefObject } from "react"
import {SectionType} from "@/components/layout/hero/HeroSection";

export function useHeroBridge(containerRef?: RefObject<HTMLDivElement | null>) {
    const [activeSection, setActiveSection] = useState<SectionType>("intro")

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Spring for smooth, high-end motion feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // --- TRANSFORMS: INTRO -> CENTER ---
    const sphereLeft = useTransform(smoothProgress, [0, 0.15], ["50%", "0%"])
    const sphereWidth = useTransform(smoothProgress, [0, 0.15], ["50%", "100%"])
    const sphereScale = useTransform(smoothProgress, [0, 0.15], [0.8, 1])

    const textOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
    const textX = useTransform(scrollYProgress, [0, 0.1], ["0%", "-5%"])

    // --- TRANSFORMS: LAYER 1 EXIT ---
    const heroExitOpacity = useTransform(scrollYProgress, [0.7, 0.85], [1, 0])
    const heroExitY = useTransform(scrollYProgress, [0.7, 1], ["0%", "-120%"])
    const heroExitScale = useTransform(scrollYProgress, [0.7, 0.9], [1, 0.8])

    // --- TRANSFORMS: LAYER 2 ENTRY ---
    const revealOpacity = useTransform(scrollYProgress, [0.75, 0.9], [0, 1])
    const revealScale = useTransform(scrollYProgress, [0.75, 1], [1.1, 1])

    // Detect section based on scroll
    const sectionIndex = useTransform(smoothProgress, [0, 0.7], [0, 3])

    useMotionValueEvent(sectionIndex, "change", (latest) => {
        const SECTIONS: SectionType[] = ["intro", "features", "capabilities", "demos"]
        const next = SECTIONS[Math.round(latest)]
        if (next !== activeSection) setActiveSection(next)
    })

    const scrollToSection = (section: SectionType) => {
        const SECTIONS: SectionType[] = ["intro", "features", "capabilities", "demos"];
        const index = SECTIONS.indexOf(section);
        if (index === -1) return;

        // The total scrollable height of the entire document
        const fullHeight = document.documentElement.scrollHeight - window.innerHeight;

        const targetProgress = (index / (SECTIONS.length - 1)) * 0.7;

        window.scrollTo({
            top: fullHeight * targetProgress,
            behavior: "smooth"
        });
    };

    return {
        activeSection,
        scrollYProgress,
        scrollToSection,
        transforms: {
            sphere: { left: sphereLeft, width: sphereWidth, scale: sphereScale },
            text: { opacity: textOpacity, x: textX },
            heroExit: { opacity: heroExitOpacity, y: heroExitY, scale: heroExitScale },
            reveal: { opacity: revealOpacity, scale: revealScale }
        }
    }
}