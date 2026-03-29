import {AnimatePresence, motion} from "framer-motion";
import {useEffect, useState} from "react";

export function ConnectionLines({
                                    ballPos,
                                    cardRefs
                                }: {
    ballPos: { x: number, y: number },
    cardRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
}) {
    const [cardPositions, setCardPositions] = useState<{x: number, y: number}[]>([])

    useEffect(() => {
        const update = () => {
            const positions = cardRefs.current
                .filter(el => el !== null)
                .map(el => {
                    const rect = el!.getBoundingClientRect()
                    return {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    }
                })
            setCardPositions(positions)
        }

        // Use RequestAnimationFrame for smoother line tracking
        let frameId = requestAnimationFrame(function sync() {
            update()
            frameId = requestAnimationFrame(sync)
        })

        return () => cancelAnimationFrame(frameId)
    }, [cardRefs, ballPos])

    return (
        <svg className="fixed inset-0 pointer-events-none z-10 w-full h-full">
            <AnimatePresence>
                {cardPositions.map((pos, i) => (
                    <motion.path
                        key={`line-${i}`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        d={`M ${ballPos.x} ${ballPos.y} L ${pos.x} ${pos.y}`}
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                        strokeDasharray="4 4"
                    />
                ))}
            </AnimatePresence>
        </svg>
    )
}