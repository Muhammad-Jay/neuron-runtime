"use client"

import React, {useRef, useEffect, useMemo, memo} from "react"
import {Canvas, useFrame, useThree} from "@react-three/fiber"
import { PerspectiveCamera, Float, ContactShadows } from "@react-three/drei"
import { useSpring } from "framer-motion"
import { SectionType } from "./HeroSection"
import * as THREE from "three"

export const Scene = memo(function Scene({ section, onUpdate }: { section: SectionType, onUpdate: (pos: { x: number, y: number }) => void }) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const scrollRotation = useSpring(0, { stiffness: 40, damping: 20 })
    const { camera, size } = useThree();

    // Create a high-detail "Stone Bump" texture
    const stoneTexture = useMemo(() => {
        const size = 512
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext("2d")!

        // Base color (Deep Neutral)
        context.fillStyle = "#2a2a2c"
        context.fillRect(0, 0, size, size)

        // Generate "Rock Pores" and "Grain"
        for (let i = 0; i < 40000; i++) {
            const x = Math.random() * size
            const y = Math.random() * size
            const grey = Math.floor(Math.random() * 40) + 20
            context.fillStyle = `rgb(${grey},${grey},${grey})`
            context.fillRect(x, y, 1, 1)
        }

        const tex = new THREE.CanvasTexture(canvas)
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping
        return tex
    }, [])

    const variants = {
        intro:        { r: 0 },
        features:     { r: Math.PI * 0.5 },
        capabilities: { r: Math.PI * 1.2 },
        demos:        { r: Math.PI * 2 },
    }

    useEffect(() => {
        scrollRotation.set(variants[section].r)
    }, [section, scrollRotation])

    useFrame((state) => {
        if (!meshRef.current) return
        const t = state.clock.getElapsedTime()

        // Vertical scroll rotation
        meshRef.current.rotation.x = scrollRotation.get()
        // Horizontal rotation - the stone texture makes this look incredible
        meshRef.current.rotation.y = t * 0.18
        meshRef.current.rotation.z = 0.15

        const vector = new THREE.Vector3()
        meshRef.current.getWorldPosition(vector)
        vector.project(camera)

        const x = (vector.x * .5 + .5) * size.width
        const y = (vector.y * -.5 + .5) * size.height

        onUpdate({ x, y })
    })

    return (
        <mesh ref={meshRef} scale={1.9}>
            <sphereGeometry args={[1, 128, 128]} />
            <meshStandardMaterial
                map={stoneTexture}         // The visual color of the stone
                bumpMap={stoneTexture}      // The physical "depth" of the pores
                bumpScale={0.015}           // Subtle but enough to catch the light
                roughness={1}               // 100% Matte
                metalness={0.1}             // Just a touch of "weight"
                flatShading={false}
            />
        </mesh>
    )
})

export const HeroSphere = memo(function HeroSphere({
                               section,
                               onBallUpdate
                           }: {
    section: SectionType,
    onBallUpdate: (pos: { x: number, y: number }) => void
}) {
    return (
        <div className="w-[420px] h-[420px] relative flex items-center justify-center">
            <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />

                {/* Single Key Light from the right to highlight the stone texture */}
                <directionalLight
                    position={[10, 5, 5]}
                    intensity={3}
                    color="#ffffff"
                />

                <ambientLight intensity={0.1} />

                <Float speed={0}>
                    <Scene section={section} onUpdate={onBallUpdate}/>
                </Float>

                <ContactShadows
                    position={[0, -2.8, 0]}
                    opacity={0.2}
                    scale={10}
                    blur={3.5}
                    far={4}
                    color="#000000"
                />
            </Canvas>
        </div>
    )
})