import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import type { ScrollCharacterRevealProps } from '../schemas'

function RevealedCharacter({ character, index, total, progress }: { character: string; index: number; total: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.2, 1])
  return <motion.span style={{ opacity }}>{character}</motion.span>
}

export function ScrollCharacterReveal({ text }: ScrollCharacterRevealProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.8', 'end 0.2'] })
  const characters = Array.from(text)

  return (
    <section ref={sectionRef} className="relative min-h-[160vh] bg-inverted px-5 font-body text-inverted-foreground md:px-10">
      <div className="sticky top-0 flex min-h-screen items-center justify-center py-24">
        <p className="relative w-full max-w-5xl whitespace-pre-wrap font-display text-heading tracking-tight">
          <span className="sr-only">{text}</span>
          <span aria-hidden="true" className="invisible block">
            {text}
          </span>
          <span aria-hidden="true" className="absolute inset-0 block">
            {characters.map((character, index) => (
              <RevealedCharacter key={index} character={character} index={index} total={characters.length} progress={scrollYProgress} />
            ))}
          </span>
        </p>
      </div>
    </section>
  )
}
