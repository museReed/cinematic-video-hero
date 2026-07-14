import { motion } from 'framer-motion'
import type { MarqueeProps } from '../schemas'
import { MOTION } from '../themes'

const durationBySpeed = { slow: 24, normal: 14, fast: 8 } as const

export function Marquee(props: MarqueeProps) {
  if (props.content === 'gif-rail') {
    const images = [...props.items, ...props.items]

    return (
      <section className="flex min-h-screen items-center overflow-hidden bg-background py-20">
        <motion.div
          className="flex w-max gap-6 px-3"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: durationBySpeed[props.speed], repeat: Infinity, ease: MOTION.easeLinear }}
        >
          {images.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" className="h-64 w-80 shrink-0 rounded-2xl object-cover" />
          ))}
        </motion.div>
      </section>
    )
  }

  const rows = props.rows ?? 2
  const labels = Array.from({ length: 8 }, (_, index) => `${props.text}-${index}`)

  return (
    <section className="flex min-h-screen flex-col justify-center gap-8 overflow-hidden bg-inverted py-20 font-body text-inverted-foreground">
      {Array.from({ length: rows }, (_, index) => (index % 2 === 0 ? 1 : -1)).map((direction, rowIndex) => (
        <motion.div
          key={rowIndex}
          className="flex w-max gap-8 whitespace-nowrap"
          animate={{ x: direction === 1 ? ['-50%', '0%'] : ['0%', '-50%'] }}
          transition={{ duration: durationBySpeed[props.speed], repeat: Infinity, ease: MOTION.easeLinear }}
        >
          {labels.map((key) => (
            <span key={`${rowIndex}-${key}`} className="font-display text-display font-black uppercase tracking-tight">
              {props.text}
            </span>
          ))}
        </motion.div>
      ))}
    </section>
  )
}
