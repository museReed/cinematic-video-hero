import { Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { QuoteParallaxProps } from '../schemas'

// eslint-disable-next-line react-refresh/only-export-components
export function getQuoteParallaxOffset(rectTop: number, rectHeight: number, viewportHeight: number) {
  const progress = (viewportHeight - rectTop) / (viewportHeight + rectHeight)
  const clampedProgress = Math.min(1, Math.max(0, progress))
  return (0.5 - clampedProgress) * 200
}

export function QuoteParallax({ quote, author, companies, portrait }: QuoteParallaxProps) {
  const portraitRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const [offset, setOffset] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const portraitNode = portraitRef.current
    if (!portraitNode || reducedMotion) {
      setOffset(0)
      return
    }

    const measure = () => {
      frameRef.current = null
      const rect = portraitNode.getBoundingClientRect()
      setOffset(getQuoteParallaxOffset(rect.top, rect.height, window.innerHeight))
    }
    const schedule = () => {
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(measure)
    }
    const attach = () => {
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
      schedule()
    }
    const detach = () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) attach()
      else detach()
    })

    observer.observe(portraitNode)
    return () => {
      observer.disconnect()
      detach()
    }
  }, [reducedMotion])

  return (
    <section className="min-h-screen overflow-hidden bg-background px-6 py-24 font-body text-foreground md:px-12">
      <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-12 md:grid-cols-[1.15fr_.85fr]">
        <div>
          <Quote aria-hidden="true" className="h-10 w-10 text-primary" />
          <blockquote className="mt-8 max-w-3xl font-display text-display tracking-tight">“{quote}”</blockquote>
          <p className="mt-8 text-body-token font-medium">{author}</p>
          {companies?.length ? (
            <p className="mt-3 text-caption uppercase tracking-widest text-muted-foreground">{companies.join(' · ')}</p>
          ) : null}
        </div>
        <div
          ref={portraitRef}
          className="overflow-hidden rounded-3xl bg-muted will-change-transform"
          style={{
            aspectRatio: 0.8,
            transform: reducedMotion ? 'none' : `translate3d(0, ${offset * 0.3}px, 0)`,
          }}
        >
          <img
            src={portrait}
            alt={`Portrait of ${author}`}
            className="h-full w-full object-cover will-change-transform"
            style={{ transform: reducedMotion ? 'none' : `translate3d(0, ${offset}px, 0) scale(1.3)` }}
          />
        </div>
      </div>
    </section>
  )
}
