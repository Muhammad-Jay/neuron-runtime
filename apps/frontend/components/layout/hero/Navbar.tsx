"use client"

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion"
import { useState, useRef } from "react"
import { AppButton } from "@/components/CustomButton"
import { Cpu, BookOpen, Layers, Zap, LogIn } from "lucide-react"
import Link from "next/link"

const NAV_LINKS = [
    { name: "Features", href: "#features", icon: Zap },
    { name: "Docs", href: "/docs", icon: BookOpen },
    { name: "Capabilities", href: "#capabilities", icon: Layers },
]

export function Navbar() {
    const { scrollY } = useScroll()
    const [hidden, setHidden] = useState(false)
    const prevScrollY = useRef(0)

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Only hide after passing the initial intro section
        if (latest > 150) {
            if (latest > prevScrollY.current) {
                setHidden(true) // Scrolling Down
            } else {
                setHidden(false) // Scrolling Up
            }
        } else {
            setHidden(false) // Always show at top
        }
        prevScrollY.current = latest
    })

    return (
        <motion.nav
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -100, opacity: 0 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[100] px-6 py-2 flex justify-center pointer-events-none"
        >
            {/* GLASS CONTAINER */}
            <div className="w-full max-w-7xl bg-white/[0.03] backdrop-blur-xl rounded-2xl px-6 py-2 flex items-center justify-between pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                <div className={"w-fit h-full gap-5 flex justify-start items-center"}>

                    {/* LEFT: LOGO */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
                            <Cpu size={18} strokeWidth={2.5} />
                        </div>
                        <span className="text-[14px] font-black uppercase tracking-[0.3em] text-white">
                        Neuron
                    </span>
                    </Link>

                    {/* CENTER: NAV LINKS */}
                    <div className="hidden md:flex items-center gap-1  p-1 rounded-xl">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <link.icon size={12} className="opacity-50" />
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className="flex items-center gap-4">
                    <Link href="/sign-in" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-white transition-colors px-4">
                        Sign In
                    </Link>
                    <AppButton
                        label="Launch Terminal"
                        variant="primary"
                        icon={<LogIn size={14} />}
                        className="bg-white text-black px-6 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    />
                </div>
            </div>
        </motion.nav>
    )
}