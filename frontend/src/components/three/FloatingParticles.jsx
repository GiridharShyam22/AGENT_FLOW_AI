import { useRef, useEffect, useMemo } from 'react'

/**
 * FloatingParticles — canvas-based background particle system
 * Renders outside WebGL so it doesn't interfere with Three.js scene
 */
export default function FloatingParticles({ count = 80, className, style }) {
  const canvasRef = useRef(null)

  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.3,
      speedX: (Math.random() - 0.5) * 0.015,
      speedY: -Math.random() * 0.02 - 0.005,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '#FFFFFF' : Math.random() > 0.5 ? '#A0A0A0' : '#888888',
    }))
  }, [count])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = particles.map(p => ({
      ...p,
      px: (p.x / 100) * width,
      py: (p.y / 100) * height,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      pts.forEach((p) => {
        p.px += p.speedX * width / 100
        p.py += p.speedY * height / 100

        if (p.py < -5) { p.py = height + 5; p.px = Math.random() * width }
        if (p.px < -5) { p.px = width + 5 }
        if (p.px > width + 5) { p.px = -5 }

        ctx.beginPath()
        ctx.arc(p.px, p.py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [particles])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
      className={className}
      aria-hidden="true"
    />
  )
}
