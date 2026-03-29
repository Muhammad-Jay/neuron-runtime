"use client"
import { motion } from "framer-motion";
import { CardFlowLines } from "./CardFlowLines";

export function NeuronCard({ item, index }: { item: any; index: number }) {
    const Icon = item.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            viewport={{ once: true }}
            className={`relative group h-[280px] rounded-3xl bg-black/40 border border-white/5 
                overflow-hidden p-8 backdrop-blur-xl flex flex-col justify-end 
                ${item.size} hover:border-white/20 transition-all duration-500`}
        >
            {/* Background SVG Data Lines */}
            <CardFlowLines color={item.color} />

            {/* Hover Highlight Glow */}
            <div
                className="absolute -top-1/4 -right-1/4 w-full h-full blur-[100px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
                style={{ backgroundColor: item.color }}
            />

            {/* Content */}
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 group-hover:text-white group-hover:bg-white/10 transition-all duration-500 shadow-xl">
                        <Icon size={20} strokeWidth={2} />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/80 group-hover:text-white">
                        {item.title}
                    </h3>
                </div>
                <p className="text-[13px] leading-relaxed text-neutral-500 group-hover:text-neutral-300 transition-colors">
                    {item.desc}
                </p>
            </div>

            {/* Bottom Subtle Corner Accent */}
            <div className="absolute bottom-0 right-0 p-2 opacity-10">
                <div className="w-6 h-[1px] bg-white" />
                <div className="w-[1px] h-6 bg-white absolute bottom-0 right-0" />
            </div>
        </motion.div>
    );
}