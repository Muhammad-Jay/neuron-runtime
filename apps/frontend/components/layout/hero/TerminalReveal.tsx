"use client"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function FabricReveal({ isActive }: { isActive: boolean }) {
    return (
        <div className="relative bg-black w-full h-full flex items-center justify-center overflow-hidden">

            {/* 2. THE CENTRAL "CORE" UNIT */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isActive ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="mb-12 text-center">
                    <h2 className="text-5xl font-extralight tracking-[0.2em] uppercase text-white mb-4">
                        System <span className="text-neutral-500">Fabric</span>
                    </h2>
                    <p className="text-xs font-mono tracking-[0.4em] text-neutral-600 uppercase">
                        Real-time Orchestration Layer Active
                    </p>
                </div>

                {/* 3. DYNAMIC FLOW VISUALIZER */}
                <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
                    {[1, 2, 3].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={isActive ? { y: 0, opacity: 1 } : {}}
                            transition={{ delay: 0.2 * i, duration: 1 }}
                            className="h-88 w-70 rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-sm group hover:border-white/20 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-green-500' : 'bg-white/20'} animate-pulse`} />
                                <span className="text-[10px] font-mono text-neutral-600">NODE_00{i}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        animate={{ x: ['-100%', '100%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i * 0.5 }}
                                        className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                    />
                                </div>
                                <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                                    Processing Payload...
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* 4. PERIPHERAL DATA DRIFT (Small floating points) */}
            {isActive && [...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{
                        x: Math.random() * 1000 - 500,
                        y: Math.random() * 1000 - 500,
                        opacity: 0
                    }}
                    animate={{
                        y: [null, Math.random() * -100 - 50],
                        opacity: [0, 0.3, 0]
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                />
            ))}
        </div>
    )
}