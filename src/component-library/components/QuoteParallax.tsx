import { Quote } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { QuoteParallaxProps } from '../schemas'

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
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      setOffset(Math.min(200, Math.max(0, progress * 200)))
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
        <div ref={portraitRef} className="overflow-hidden rounded-3xl bg-muted" style={{ aspectRatio: 0.8 }}>
          <img
            src={portrait}
            alt={`Portrait of ${author}`}
            className="h-full w-full scale-125 object-cover will-change-transform"
            style={{ transform: reducedMotion ? 'none' : `translate3d(0, ${offset}px, 0) scale(1.25)` }}
          />
        </div>
      </div>
    </section>
  )
}
