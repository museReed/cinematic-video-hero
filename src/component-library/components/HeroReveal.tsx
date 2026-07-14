import { motion } from 'framer-motion'
import type { HeroRevealProps } from '../schemas'
import { MOTION } from '../themes'

export function HeroReveal({ eyebrow, title, ctaLabel }: HeroRevealProps) {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-inverted px-6 py-24 text-center font-body text-inverted-foreground">
      <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 0.45, y: 0 }} className="text-caption uppercase tracking-[.35em]">
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (MOTION.staggerStep * 15) / 10, duration: MOTION.durationBase }}
        className="mt-5 max-w-5xl font-display text-display"
      >
        {title}
      </motion.h1>
      {ctaLabel ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: MOTION.staggerStep * 5 }}
          className="mt-10 rounded-full bg-primary px-6 py-3 text-caption uppercase tracking-widest text-primary-foreground"
        >
          {ctaLabel}
        </motion.div>
      ) : null}
    </section>
  )
}
