import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { InviewEntranceProps, PointerMagnetProps } from './schemas'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const FINE_POINTER_QUERY = '(pointer: fine)'

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

export function InviewEntrance({
  children,
  delay = 0,
  x = 0,
  y = 30,
  duration = 0.7,
}: InviewEntranceProps & { children: ReactNode }) {
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY)

  if (reduceMotion) return <motion.div initial={false}>{children}</motion.div>

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function PointerMagnet({
  children,
  strength = 3,
  radiusPx = 150,
}: PointerMagnetProps & { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const finePointer = useMediaQuery(FINE_POINTER_QUERY)
  const reduceMotion = useMediaQuery(REDUCED_MOTION_QUERY)
  const enabled = finePointer && !reduceMotion

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!enabled || !wrapper) return

    const reset = () => {
      wrapper.style.transition = 'transform 600ms ease-in-out'
      wrapper.style.transform = 'translate3d(0, 0, 0)'
    }
    const handlePointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect()
      const deltaX = event.clientX - (rect.left + rect.width / 2)
      const deltaY = event.clientY - (rect.top + rect.height / 2)

      if (Math.hypot(deltaX, deltaY) > radiusPx) {
        reset()
        return
      }

      wrapper.style.transition = 'transform 300ms ease-out'
      wrapper.style.transform = `translate3d(${deltaX / strength}px, ${deltaY / strength}px, 0)`
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', reset)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', reset)
      reset()
    }
  }, [enabled, radiusPx, strength])

  if (!enabled) return children

  return (
    <div ref={wrapperRef} style={{ transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}>
      {children}
    </div>
  )
}
