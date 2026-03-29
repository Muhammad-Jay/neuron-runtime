"use client"
import { motion } from "framer-motion";

export function CardFlowLines({ color }: { color: string }) {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
            <motion.path
                d="M -20 100 Q 50 50 120 100 T 260 100" // Abstract curve
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="10 20"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -100 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
                d="M -20 20 Q 150 150 300 20"
                fill="none"
                stroke={color}
                strokeWidth="1"
                strokeDasharray="5 15"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 100 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
        </svg>
    );
}