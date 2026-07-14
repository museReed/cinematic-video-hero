import { motion } from 'framer-motion'
import type { ScrollMarqueeProps } from '../schemas'
import { MOTION } from '../themes'

const durationBySpeed = { slow: 24, normal: 14, fast: 8 } as const

export function ScrollMarquee({ text, repeat, speed }: ScrollMarqueeProps) {
  const labels = Array.from({ length: repeat }, (_, index) => `${text}-${index}`)

  return (
    <section className="flex min-h-screen flex-col justify-center gap-8 overflow-hidden bg-inverted py-20 font-body text-inverted-foreground">
      {[1, -1].map((direction) => (
        <motion.div
          key={direction}
          className="flex w-max gap-8 whitespace-nowrap"
          animate={{ x: direction === 1 ? ['-12%', '0%'] : ['0%', '-12%'] }}
          transition={{ duration: durationBySpeed[speed], repeat: Infinity, repeatType: 'mirror', ease: MOTION.easeLinear }}
        >
          {labels.map((key) => (
            <span key={`${direction}-${key}`} className="font-display text-display font-black uppercase tracking-tight">
              {text}
            </span>
          ))}
        </motion.div>
      ))}
    </section>
  )
}
