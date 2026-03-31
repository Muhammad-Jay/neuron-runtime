"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SectionType } from "./HeroSection";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { DATA } from "@/constants";

export const FloatingElements = memo(function FloatingElements({
                                                                   section,
                                                                   cardRefs
                                                               }: {
    section: SectionType,
    cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
    const items = DATA[section] || [];
    const leftItems = items.filter(i => i.side === "left");
    const rightItems = items.filter(i => i.side === "right");

    const renderColumn = (columnItems: typeof items, side: "left" | "right") => (
        <div
            className={cn(
                "absolute top-1/2 -translate-y-1/2 pt-10 z-50 flex flex-col gap-15 w-[380px]",
                side === "left" ? "right-[120%] items-end" : "left-[120%] items-start"
            )}
        >
            <AnimatePresence mode="wait">
                {columnItems.map((item, i) => {
                    const Icon = item.icon;
                    const refIndex = side === "left" ? i : i + leftItems.length;

                    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
                        const { currentTarget, clientX, clientY } = e;
                        const { left, top } = currentTarget.getBoundingClientRect();
                        const x = clientX - left;
                        const y = clientY - top;
                        currentTarget.style.setProperty("--mouse-x", `${x}px`);
                        currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    };

                    return (
                        <motion.div
                            key={item.title}
                            onMouseMove={handleMouseMove}
                            ref={(el) => { cardRefs.current[refIndex] = el }}
                            initial={{ opacity: 0, x: side === "left" ? -60 : 60, scale: 0.95, filter: "blur(20px)" }}
                            animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, x: side === "left" ? -60 : 60, scale: 0.95, filter: "blur(20px)" }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                delay: i * 0.1
                            }}
                            whileHover={{
                                scale: 1.05
                            }}
                            className="group relative w-[330px] p-6 rounded-xl overflow-hidden transition-all duration-700"
                        >
                            {/* --- GLASS BASE --- */}
                            <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-3xl" />

                            {/* --- BORDER / GLOW SYSTEM --- */}
                            <div className="absolute inset-0 rounded-lg border border-white/[0.05] group-hover:border-white/[0.15] transition-colors duration-500" />
                            {/*<div className="absolute inset-px rounded-lg bg-gradient-to-b from-white/[0.08] to-transparent opacity-50" />*/}

                            {/* --- INTERACTIVE LIGHT SWEEP --- */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(255,255,255,0.06),transparent_80%)]" />

                            {/* --- CONTENT --- */}
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                                        <div className="relative p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white">
                                            <Icon size={18} strokeWidth={1.5} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/30 group-hover:text-white/50 transition-colors">
                                            Module.0{i + 1}
                                        </span>
                                        <h3 className="text-sm font-semibold text-white tracking-tight">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                <p className="text-[12px] leading-relaxed text-neutral-400 font-medium group-hover:text-neutral-300 transition-colors">
                                    {item.desc}
                                </p>

                                {/* --- DECORATIVE TECHNICAL FOOTER --- */}
                                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                                    <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-tighter">
                                        Status: Ready_Active
                                    </span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-white transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );

    return (
        <>
            {renderColumn(leftItems, "left")}
            {renderColumn(rightItems, "right")}
        </>
    );
});