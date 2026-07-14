import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type CSSProperties } from 'react'
import type { StickyCardStackProps } from '../schemas'

type StickyCardProps = {
  item: StickyCardStackProps['items'][number]
  index: number
  total: number
  offsetPx: number
}

function StickyCard({ item, index, total, offsetPx }: StickyCardProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'start start'] })
  const targetScale = 1 - (total - 1 - index) * 0.03
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale])
  const offsetStyle = { '--stack-offset': `${index * offsetPx}px` } as CSSProperties

  return (
    <div ref={containerRef} className="min-h-[85vh]" style={offsetStyle}>
      <motion.article
        style={{ scale, zIndex: index + 1 }}
        className="sticky top-[calc(6rem+var(--stack-offset))] origin-top overflow-hidden rounded-3xl bg-card text-card-foreground shadow-xl will-change-transform md:top-[calc(8rem+var(--stack-offset))]"
      >
        {item.image ? (
          <div className="aspect-[16/7] max-h-[34svh] overflow-hidden bg-muted">
            <img src={item.image} alt={`Visual for ${item.title}`} className="h-full w-full object-cover" />
          </div>
        ) : null}
        <div className="grid min-h-48 content-between gap-8 p-7 md:grid-cols-[auto_1fr] md:p-10">
          <span className="text-caption uppercase tracking-widest text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h2 className="font-display text-heading tracking-tight">{item.title}</h2>
            {item.body ? <p className="mt-4 max-w-2xl text-body-token text-muted-foreground">{item.body}</p> : null}
          </div>
        </div>
      </motion.article>
    </div>
  )
}

export function StickyCardStack({ items, offsetPx = 28 }: StickyCardStackProps) {
  return (
    <section aria-label="Sticky card sequence" className="bg-background px-5 py-24 font-body text-foreground md:px-10">
      <div className="mx-auto max-w-5xl pb-[30vh]">
        {items.map((item, index) => (
          <StickyCard key={`${item.title}-${index}`} item={item} index={index} total={items.length} offsetPx={offsetPx} />
        ))}
      </div>
    </section>
  )
}
