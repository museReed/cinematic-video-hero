import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { TestimonialCarouselProps } from '../schemas'

const CARD_GAP = 24

export function TestimonialCarousel({ items, autoAdvanceMs = 3000, cardWidth = 428 }: TestimonialCarouselProps) {
  const [index, setIndex] = useState(items.length)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const [measuredWidth, setMeasuredWidth] = useState(cardWidth)
  const cardRef = useRef<HTMLElement>(null)
  const restoreFrameRef = useRef<number | null>(null)
  const loop = useMemo(() => [...items, ...items, ...items], [items])
  const activeItem = items[((index % items.length) + items.length) % items.length]

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const update = () => setMeasuredWidth(card.getBoundingClientRect().width)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(card)
    return () => observer.disconnect()
  }, [cardWidth])

  useEffect(() => {
    if (paused || reducedMotion) return
    const timer = window.setInterval(() => setIndex((current) => current + 1), autoAdvanceMs)
    return () => window.clearInterval(timer)
  }, [autoAdvanceMs, paused, reducedMotion])

  useEffect(() => {
    if (!reducedMotion) return
    if (index >= items.length * 2) setIndex(items.length)
    if (index < items.length) setIndex(items.length * 2 - 1)
  }, [index, items.length, reducedMotion])

  useEffect(
    () => () => {
      if (restoreFrameRef.current !== null) cancelAnimationFrame(restoreFrameRef.current)
    },
    [],
  )

  const move = (direction: -1 | 1) => setIndex((current) => current + direction)

  const handleTransitionEnd = () => {
    let recenteredIndex: number | null = null
    if (index >= items.length * 2) recenteredIndex = items.length
    if (index < items.length) recenteredIndex = items.length * 2 - 1
    if (recenteredIndex === null) return

    setTransitionEnabled(false)
    setIndex(recenteredIndex)
    restoreFrameRef.current = requestAnimationFrame(() => {
      restoreFrameRef.current = requestAnimationFrame(() => setTransitionEnabled(true))
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  return (
    <section
      aria-label="Testimonials"
      tabIndex={0}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-background py-20 font-body text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      onKeyDown={handleKeyDown}
    >
      <div className="mx-auto mb-10 flex w-full max-w-6xl items-end justify-between px-6">
        <h2 className="font-display text-heading">Testimonials</h2>
        <p className="text-caption uppercase tracking-widest text-muted-foreground">{items.length} voices</p>
      </div>

      <div
        className="flex w-max items-stretch"
        style={{
          gap: CARD_GAP,
          transform: `translateX(calc(50vw - ${index * (measuredWidth + CARD_GAP) + measuredWidth / 2}px))`,
          transition: transitionEnabled && !reducedMotion ? 'transform 800ms cubic-bezier(.22, 1, .36, 1)' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
        aria-hidden="true"
      >
        {loop.map((item, itemIndex) => (
          <article
            ref={itemIndex === 0 ? cardRef : undefined}
            key={`${item.author}-${item.company}-${itemIndex}`}
            className="flex min-h-72 shrink-0 flex-col rounded-3xl bg-card p-8 text-card-foreground shadow-lg"
            style={{ width: cardWidth, maxWidth: 'calc(100vw - 3rem)' }}
          >
            <Quote aria-hidden="true" className="h-7 w-7 text-primary" />
            <blockquote className="mt-8 font-display text-heading">“{item.quote}”</blockquote>
            <footer className="mt-auto pt-10">
              <p className="text-body-token font-medium">{item.author}</p>
              <p className="mt-1 text-caption uppercase tracking-widest text-muted-foreground">{item.company}</p>
            </footer>
          </article>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {activeItem.quote} — {activeItem.author}, {activeItem.company}
      </p>
      <div className="mx-auto mt-10 flex w-full max-w-6xl gap-3 px-6">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => move(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => move(1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
}
