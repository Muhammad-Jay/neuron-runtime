'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface MaintenanceStateProps {
    title?: string;
    description?: string;
    showBackButton?: boolean;
}

export function MaintenanceState({
                                     title = "Refining this Space",
                                     description = "We're currently polishing this feature to meet our standards. It will be available for deployment shortly.",
                                     showBackButton = true,
                                 }: MaintenanceStateProps) {
    const router = useRouter();

    return (
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#030303] px-6 text-center">
            {/* Background Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-[400px] w-[400px] rounded-full bg-white/[0.02] blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex max-w-md flex-col items-center"
            >
                {/* Aesthetic Icon Wrapper */}
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl border border-neutral-800 bg-neutral-900/50 shadow-2xl backdrop-blur-sm">
                    <Sparkles className="text-neutral-400" size={28} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h1 className="mb-4 text-xl font-medium tracking-tight text-neutral-100 italic">
                    {title}
                </h1>
                <p className="mb-10 text-[13px] leading-relaxed text-neutral-500">
                    {description}
                </p>

                {/* Actions */}
                {showBackButton && (
                    <Button
                        onClick={() => router.back()}
                        variant="ghost"
                        className="group flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-neutral-400 uppercase transition-colors hover:text-white"
                    >
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                        Return to Dashboard
                    </Button>
                )}
            </motion.div>

            {/* Subtle Status Footer */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/30 px-4 py-1.5">
                    <div className="h-1 w-1 animate-pulse rounded-full bg-neutral-500" />
                    <span className="text-[9px] font-black tracking-[0.2em] text-neutral-600 uppercase">
            Maintenance in progress
          </span>
                </div>
            </div>
        </div>
    );
}