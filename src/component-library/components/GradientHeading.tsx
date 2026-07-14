import type { GradientHeadingProps } from '../schemas'

export function GradientHeading({ text, from, to }: GradientHeadingProps) {
  const backgroundImage = `linear-gradient(180deg, ${from ?? 'var(--foreground)'} 0%, ${to ?? 'var(--primary)'} 100%)`

  return (
    <section className="flex min-h-screen w-full items-center overflow-hidden bg-background px-4 py-24 font-body text-foreground md:px-10">
      <h2 className="relative mx-auto w-full max-w-7xl break-words font-display text-display font-black uppercase tracking-[-0.04em] [overflow-wrap:anywhere]">
        <span>{text}</span>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-clip-text text-transparent"
          style={{ backgroundImage, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {text}
        </span>
      </h2>
    </section>
  )
}
