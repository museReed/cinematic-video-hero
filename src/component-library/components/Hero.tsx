import { motion } from 'framer-motion'
import type { HeroProps } from '../schemas'
import { MOTION } from '../themes'

export function Hero({ eyebrow, title, body, ctaLabel, layout = 'cinematic' }: HeroProps) {
  if (layout === 'editorial') {
    const reveal = (step: number) => ({
      delay: MOTION.staggerStep * step,
      duration: MOTION.durationSlow,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    })

    return (
      <section className="flex min-h-screen items-center bg-background px-6 py-24 font-body text-foreground">
        <div className="mx-auto w-full max-w-[440px]">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reveal(1)}
            className="font-display text-heading tracking-tight"
          >
            {eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reveal(2)}
            className="mt-8 font-display text-display tracking-tight"
          >
            {title}
          </motion.h1>
          {body ? (
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reveal(3)}
              className="mt-8 text-body-token text-muted-foreground"
            >
              {body}
            </motion.p>
          ) : null}
          {ctaLabel ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reveal(4)}
              className="mt-10 inline-flex rounded-full bg-primary px-6 py-3 text-caption uppercase tracking-widest text-primary-foreground"
            >
              {ctaLabel}
            </motion.div>
          ) : null}
        </div>
      </section>
    )
  }

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
      {body ? <p className="mt-6 max-w-2xl text-body-token text-inverted-foreground opacity-70">{body}</p> : null}
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
