import { motion } from 'framer-motion'
import type { HeroRevealProps } from '../schemas'

export function HeroReveal({ eyebrow, title, ctaLabel }: HeroRevealProps) {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
      style={{ backgroundColor: 'var(--ck-color-dark-surface)', color: 'var(--ck-color-dark-ink)', fontFamily: 'var(--ck-font-body)' }}
    >
      <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 0.45, y: 0 }} className="text-xs uppercase tracking-[.35em]">
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="mt-5 max-w-5xl text-6xl leading-none md:text-8xl"
        style={{ fontFamily: 'var(--ck-font-display)' }}
      >
        {title}
      </motion.h1>
      {ctaLabel ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-full border px-6 py-3 text-xs uppercase tracking-widest"
          style={{ borderColor: 'var(--ck-color-dark-ink)' }}
        >
          {ctaLabel}
        </motion.div>
      ) : null}
    </section>
  )
}
