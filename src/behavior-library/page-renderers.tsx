import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react'
import type { PointerOverlayProps, ScrollDirectorProps } from './schemas'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const FINE_POINTER_QUERY = '(pointer: fine)'
const TRAIL_INTERVAL_MS = 80
const TRAIL_LIFETIME_MS = 1000
const TRAIL_LIMIT = 10

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const updateMatch = () => setMatches(mediaQuery.matches)

    updateMatch()
    mediaQuery.addEventListener('change', updateMatch)
    return () => mediaQuery.removeEventListener('change', updateMatch)
  }, [query])

  return matches
}

type TrailItem = {
  id: number
  src: string
  x: number
  y: number
  rotate: number
}

function PointerCursor({ children }: { children: ReactNode }) {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const scale = useMotionValue(1)

  useEffect(() => {
    const previousCursor = document.documentElement.style.cursor
    const hideNativeCursor = () => { document.documentElement.style.cursor = 'none' }
    const showNativeCursor = () => { document.documentElement.style.cursor = previousCursor }
    const handlePointerMove = (event: PointerEvent) => {
      hideNativeCursor()
      x.set(event.clientX - 10)
      y.set(event.clientY - 10)
      const target = event.target instanceof Element ? event.target : null
      scale.set(target?.closest('a, button, input, select, textarea, [role="button"]') ? 1.6 : 1)
    }
    const handlePointerLeave = () => {
      x.set(-100)
      y.set(-100)
      scale.set(1)
      showNativeCursor()
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)
    hideNativeCursor()
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      showNativeCursor()
    }
  }, [scale, x, y])

  return (
    <Fragment>
      {children}
      <motion.div
        aria-hidden="true"
        style={{
          x,
          y,
          scale,
          position: 'fixed',
          top: 0,
          left: 0,
          width: 20,
          height: 20,
          border: '1px solid currentColor',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 50,
          willChange: 'transform',
        }}
      />
    </Fragment>
  )
}

function PointerTrail({ children, items }: { children: ReactNode; items: string[] }) {
  const [trail, setTrail] = useState<TrailItem[]>([])
  const lastSpawn = useRef(-TRAIL_INTERVAL_MS)
  const nextId = useRef(0)
  const timers = useRef(new Map<number, number>())

  useEffect(() => {
    const activeTimers = timers.current
    const handlePointerMove = (event: PointerEvent) => {
      const now = performance.now()
      if (now - lastSpawn.current < TRAIL_INTERVAL_MS) return
      lastSpawn.current = now

      const id = nextId.current++
      const item = {
        id,
        src: items[id % items.length],
        x: event.clientX,
        y: event.clientY,
        rotate: Math.random() * 20 - 10,
      }
      setTrail((current) => [...current.slice(-(TRAIL_LIMIT - 1)), item])
      activeTimers.set(id, window.setTimeout(() => {
        setTrail((current) => current.filter((candidate) => candidate.id !== id))
        activeTimers.delete(id)
      }, TRAIL_LIFETIME_MS))
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      activeTimers.forEach((timer) => window.clearTimeout(timer))
      activeTimers.clear()
    }
  }, [items])

  return (
    <Fragment>
      {children}
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        {trail.map((item) => (
          <motion.img
            key={item.id}
            src={item.src}
            alt=""
            initial={{ opacity: 1, scale: 1, rotate: item.rotate }}
            animate={{ opacity: 0, scale: 0, rotate: item.rotate }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              left: item.x,
              top: item.y,
              width: 120,
              height: 80,
              marginLeft: -60,
              marginTop: -40,
              objectFit: 'cover',
              transformOrigin: 'center',
            }}
          />
        ))}
      </div>
    </Fragment>
  )
}

export function PointerOverlay({ children, variant, items = [] }: PointerOverlayProps & { children: ReactNode }) {
  const finePointer = useMediaQuery(FINE_POINTER_QUERY)
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY)

  if (!finePointer || reduceMotion) return children
  if (variant === 'trail') return items.length > 0 ? <PointerTrail items={items}>{children}</PointerTrail> : children
  return <PointerCursor>{children}</PointerCursor>
}

function phaseProgress(progress: number, start: number, end: number) {
  return Math.min(1, Math.max(0, (progress - start) / (end - start)))
}

export function ScrollDirector({
  children,
  phases = ['intro', 'archive', 'exit'],
}: ScrollDirectorProps & { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const hasIntro = phases.includes('intro')
  const hasArchive = phases.includes('archive')
  const hasExit = phases.includes('exit')
  const opacity = useTransform(scrollYProgress, (latest) => {
    const progress = Math.min(1, Math.max(0, latest))
    const introOpacity = hasIntro ? phaseProgress(progress, 0, 0.25) : 1
    const exitOpacity = hasExit ? 1 - phaseProgress(progress, 0.75, 1) * 0.35 : 1
    return introOpacity * exitOpacity
  })
  const scale = useTransform(scrollYProgress, (latest) => {
    const progress = Math.min(1, Math.max(0, latest))
    return hasExit ? 1 - phaseProgress(progress, 0.75, 1) * 0.12 : 1
  })
  const y = useTransform(scrollYProgress, (latest) => {
    const progress = Math.min(1, Math.max(0, latest))
    const introY = hasIntro ? (1 - phaseProgress(progress, 0, 0.25)) * 32 : 0
    const archiveY = hasArchive ? phaseProgress(progress, 0.25, 0.75) * -12 : 0
    const exitY = hasExit ? phaseProgress(progress, 0.75, 1) * -48 : 0
    return introY + archiveY + exitY
  })

  if (reduceMotion) return children

  return (
    <div ref={containerRef} data-scroll-director="true">
      <motion.div style={{ opacity, scale, y, transformOrigin: 'center top', willChange: 'transform, opacity' }}>
        {children}
      </motion.div>
    </div>
  )
}
