"use client"

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { FloatingItem } from "@/constants";

export function FragmentCard({
                                 item
                             }: {
    item: FloatingItem;
}) {
    const Icon = item.icon;

    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            className="group relative w-[340px] p-5 text-left"
        >
            {/* CLIPPED SURFACE */}
            <div
                className="absolute inset-0 border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
                style={{ clipPath: item.shape.clipPath }}
            />

            {/* SVG PATH LAYER */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* base path */}
                <path
                    d={item.shape.path}
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="1"
                    fill="none"
                />

                {/* animated glow path */}
                <motion.path
                    d={item.shape.path}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="1.5"
                    fill="none"
                    pathLength={1}
                    initial={{ strokeDashoffset: 1, opacity: 0 }}
                    whileHover={{ strokeDashoffset: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{
                        strokeDasharray: 1,
                        filter: "url(#glow)"
                    }}
                />
            </svg>

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg border border-white/[0.08] bg-white/[0.03]">
                        <Icon size={14} className="text-neutral-300" />
                    </div>

                    <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-200">
                        {item.title}
                    </p>
                </div>

                <p className="text-[11px] leading-relaxed text-neutral-500">
                    {item.desc}
                </p>
            </div>
        </motion.div>
    );
}