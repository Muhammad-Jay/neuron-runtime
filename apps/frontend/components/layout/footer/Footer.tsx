"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Zap, ArrowRight, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const footerLinks = [
    { name: "Platform", links: ["Intelligence", "Flows", "Integration", "Security"] },
    { name: "Resources", links: ["Documentation", "University", "API Status", "Changelog"] },
    { name: "Company", links: ["Our Story", "Careers", "Press Kit", "Contact"] },
];

const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Mail, href: "#", label: "Email" },
];

// Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const ctaVariants: Variants = {
    hover: {
        scale: 1.03,
        y: -5,
        transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
};

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 border-t border-white/[0.03] bg-neutral-950 text-neutral-300 overflow-hidden font-sans">

            {/* Smooth Background Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />

            <motion.div
                className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-16">

                    {/* --- 1. THE MASSIVE CALL TO ACTION --- */}
                    <motion.div className="md:col-span-2 space-y-6" variants={itemVariants}>
                        <div className="flex items-center gap-2 text-white">
                            <Zap className="w-6 h-6 text-primary fill-primary" />
                            <span className="text-xl font-bold tracking-tight">Neuron</span>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-white max-w-sm leading-[1.1]">
                            Ready to orchestrate your data stream?
                        </h2>
                        <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                            Join the next generation of data-driven teams. Start building intelligent automation today, no complex configuration required.
                        </p>

                        <motion.div
                            variants={ctaVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="inline-block"
                        >
                            <Button
                                className="group h-14 px-8 gap-3 bg-white text-black hover:bg-neutral-100 rounded-2xl shadow-2xl transition-colors duration-300 active:scale-95"
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em]">Begin Your Journey</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* --- 2. SMOOTH NAV COLUMNS --- */}
                    <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-6">
                        {footerLinks.map((section) => (
                            <motion.div key={section.name} className="space-y-5" variants={itemVariants}>
                                <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-600">
                                    {section.name}
                                </h5>
                                <ul className="space-y-3.5">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a
                                                href="#"
                                                className="group relative inline-flex items-center text-[13px] text-neutral-400 hover:text-white transition-colors duration-300"
                                            >
                                                {link}
                                                {/* Smooth Underline Animation */}
                                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-300 ease-out" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* --- 3. THE REFINED BOTTOM BAR --- */}
                <motion.div
                    className="mt-16 md:mt-24 pt-8 border-t border-white/[0.03] flex flex-col-reverse sm:flex-row items-center justify-between gap-6"
                    variants={itemVariants}
                >
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-neutral-700 font-mono tracking-tight">
                        <span>© {currentYear} Neuron Engine</span>
                        <div className="hidden sm:block w-px h-3 bg-white/5" />
                        <a href="#" className="hover:text-neutral-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-neutral-500 transition-colors">Terms of Service</a>
                    </div>

                    {/* Icon Socials */}
                    <div className="flex items-center gap-1.5">
                        {socialLinks.map((social) => {
                            const Icon = social.icon;
                            return (
                                <motion.a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="p-2.5 rounded-xl text-neutral-600 hover:text-white hover:bg-white/[0.03] transition-all duration-300"
                                    whileHover={{ y: -3 }}
                                >
                                    <Icon size={18} strokeWidth={1.5} />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    );
}