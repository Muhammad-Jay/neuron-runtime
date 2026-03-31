"use client";

import { motion } from "framer-motion";
import {ParticleField} from "@/components/layout/hero/background/ParticleField";

export function HeroBackground() {
    return (
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_40%)] overflow-hidden">
            {/* Primary Focal Glow (Center) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.01] rounded-full blur-[120px]" />

            {/* Ambient Top Light */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-white/[0.01] rounded-full blur-[100px] -rotate-12" />

            {/* Deep Bottom Shadow Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-black to-transparent opacity-80" />

            {/* The Particle Canvas */}
            <ParticleField />
        </div>
    );
}