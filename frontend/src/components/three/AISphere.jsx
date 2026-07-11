import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial, Sphere, GradientTexture } from '@react-three/drei'

// Inner animated sphere that reacts to mouse
function AnimatedSphere({ mouseX, mouseY }) {
  const meshRef = useRef()
  const targetRotX = useRef(0)
  const targetRotY = useRef(0)

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()

    // Base slow auto-rotation
    targetRotY.current = mouseX.current * 0.6 + time * 0.12
    targetRotX.current = mouseY.current * 0.4

    // Smooth lerp to target rotation
    meshRef.current.rotation.y += (targetRotY.current - meshRef.current.rotation.y) * 0.04
    meshRef.current.rotation.x += (targetRotX.current - meshRef.current.rotation.x) * 0.04

    // Subtle breathing scale
    const scale = 1 + Math.sin(time * 0.8) * 0.025
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef}>
      <Sphere args={[1.6, 128, 128]}>
        <MeshDistortMaterial
          distort={0.38}
          speed={2.2}
          roughness={0.08}
          metalness={0.15}
          transparent
          opacity={0.92}
        >
          <GradientTexture
            stops={[0, 0.4, 0.7, 1]}
            colors={['#FFFFFF', '#A0A0A0', '#888888', '#FFFFFF']}
          />
        </MeshDistortMaterial>
      </Sphere>
    </mesh>
  )
}

// Orbiting ring
function Ring() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.getElapsedTime() * 0.2
    ref.current.rotation.z = clock.getElapsedTime() * 0.1
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 3, 0, 0]}>
      <torusGeometry args={[2.4, 0.012, 16, 200]} />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.35} />
    </mesh>
  )
}

// Second orbiting ring
function Ring2() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.x = clock.getElapsedTime() * -0.15
    ref.current.rotation.y = clock.getElapsedTime() * 0.25
  })
  return (
    <mesh ref={ref} rotation={[Math.PI / 5, Math.PI / 4, 0]}>
      <torusGeometry args={[2.8, 0.008, 16, 200]} />
      <meshBasicMaterial color="#888888" transparent opacity={0.2} />
    </mesh>
  )
}

// Floating particles around the sphere
function Particles() {
  const ref = useRef()
  const count = 60

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.random() * Math.PI
    const r     = 2.2 + Math.random() * 1.2
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.05
    ref.current.rotation.x = clock.getElapsedTime() * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#888888"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  )
}

export default function AISphere() {
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  useEffect(() => {
    const handleMove = (e) => {
      // Normalize to -1 → 1
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * -2
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', minHeight: 480 }}>
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={2.5} color="#FFFFFF" />
        <pointLight position={[-5, -5, 3]} intensity={1.8} color="#A0A0A0" />
        <pointLight position={[0, 5, -3]} intensity={1.2} color="#888888" />

        {/* Scene objects */}
        <AnimatedSphere mouseX={mouseX} mouseY={mouseY} />
        <Ring />
        <Ring2 />
        <Particles />
      </Canvas>
    </div>
  )
}
