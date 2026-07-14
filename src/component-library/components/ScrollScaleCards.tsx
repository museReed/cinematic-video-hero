import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { ScrollScaleCardsProps } from '../schemas'

type ScrollScaleCardProps = {
  item: ScrollScaleCardsProps['items'][number]
  minScale: number
  index: number
}

function ScrollScaleCard({ item, minScale, index }: ScrollScaleCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const distance = useMotionValue(1)
  const scale = useTransform(distance, [0, 1], [1, minScale])
  const opacity = useTransform(distance, [0, 1], [1, 0.55])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const measure = () => {
      frameRef.current = null
      const rect = card.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const cardCenter = rect.top + rect.height / 2
      const maximumDistance = viewportCenter + rect.height / 2
      distance.set(Math.min(1, Math.abs(cardCenter - viewportCenter) / maximumDistance))
    }
    const schedule = () => {
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(measure)
    }
    const resizeObserver = new ResizeObserver(schedule)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    resizeObserver.observe(card)
    schedule()

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resizeObserver.disconnect()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [distance])

  return (
    <motion.article ref={cardRef} style={{ opacity, scale }} className="origin-center will-change-transform">
      <div className="overflow-hidden rounded-3xl bg-card text-card-foreground shadow-lg transition-transform duration-300 hover:scale-[1.01]">
        {item.image ? (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            <img src={item.image} alt={`Visual for ${item.title}`} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div className="grid gap-4 p-7 md:grid-cols-[auto_1fr] md:p-10">
          <span className="text-caption uppercase tracking-widest text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h2 className="font-display text-heading tracking-tight">{item.title}</h2>
            {item.body ? <p className="mt-4 max-w-2xl text-body-token text-muted-foreground">{item.body}</p> : null}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export function ScrollScaleCards({ items, scaleRange }: ScrollScaleCardsProps) {
  const minScale = scaleRange?.min ?? 0.88

  return (
    <section aria-label="Scroll focus cards" className="bg-background px-5 py-[20vh] font-body text-foreground md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-[18vh]">
        {items.map((item, index) => (
          <ScrollScaleCard key={`${item.title}-${index}`} item={item} minScale={minScale} index={index} />
        ))}
      </div>
    </section>
  )
}
