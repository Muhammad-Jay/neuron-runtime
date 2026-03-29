"use client"
import { NEURON_PILLARS } from "@/constants";
import { NeuronCard } from "./NeuronCard";

export function WhatIsNeuron() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-6 py-32 flex flex-col items-center">
            {/* SECTION HEADER */}
            <div className="text-center mb-24 max-w-xl">
                <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-white mb-6">
                    A Single Point of <span className="text-neutral-500 italic">Execution.</span>
                </h2>
                <div className="h-[1px] w-16 bg-white/20 mx-auto" />
            </div>

            {/* ASYMMETRIC GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                {NEURON_PILLARS.map((item, i) => (
                    <NeuronCard key={i} item={item} index={i} />
                ))}
            </div>
        </section>
    );
}