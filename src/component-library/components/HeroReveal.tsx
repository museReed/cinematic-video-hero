import { motion } from 'framer-motion'
import type { HeroRevealProps } from '../schemas'
import { THEME_TOKENS } from '../tokens'

export function HeroReveal({ eyebrow, title, ctaLabel }: HeroRevealProps) {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center text-white"
      style={{ backgroundColor: THEME_TOKENS.colors.black, fontFamily: THEME_TOKENS.fonts.body }}
    >
      <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-xs uppercase tracking-[.35em] text-white/45">
        {eyebrow}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="mt-5 max-w-5xl text-6xl leading-none md:text-8xl"
        style={{ fontFamily: THEME_TOKENS.fonts.display }}
      >
        {title}
      </motion.h1>
      {ctaLabel ? (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 rounded-full border border-white/20 px-6 py-3 text-xs uppercase tracking-widest"
        >
          {ctaLabel}
        </motion.div>
      ) : null}
    </section>
  )
}
