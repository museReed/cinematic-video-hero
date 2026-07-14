import { motion } from 'framer-motion'
import type { ScrollMarqueeProps } from '../schemas'
import { THEME_TOKENS } from '../tokens'

const durationBySpeed = { slow: 24, normal: 14, fast: 8 } as const

export function ScrollMarquee({ text, repeat, speed }: ScrollMarqueeProps) {
  const labels = Array.from({ length: repeat }, (_, index) => `${text}-${index}`)

  return (
    <section className="flex min-h-screen flex-col justify-center gap-8 overflow-hidden py-20 text-white" style={{ backgroundColor: THEME_TOKENS.colors.black }}>
      {[1, -1].map((direction) => (
        <motion.div
          key={direction}
          className="flex w-max gap-8 whitespace-nowrap"
          animate={{ x: direction === 1 ? ['-12%', '0%'] : ['0%', '-12%'] }}
          transition={{ duration: durationBySpeed[speed], repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
        >
          {labels.map((key) => (
            <span key={`${direction}-${key}`} className="text-6xl font-black uppercase tracking-tight md:text-9xl" style={{ fontFamily: THEME_TOKENS.fonts.display }}>
              {text}
            </span>
          ))}
        </motion.div>
      ))}
    </section>
  )
}
