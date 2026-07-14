import { Folder, MousePointer2, Search, Share2, Sparkles } from 'lucide-react'
import type { FeatureCardProps, FeatureGridProps } from '../schemas'

function PromptDecoration() {
  return (
    <div aria-hidden="true" className="relative h-56 overflow-hidden bg-muted p-6">
      <div className="rounded-2xl bg-background p-4 text-caption leading-relaxed text-muted-foreground shadow-lg">
        Turn a simple idea into a more detailed visual prompt.
      </div>
      <span className="absolute left-10 top-32 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-caption font-medium text-card-foreground shadow-lg">
        <Sparkles className="h-4 w-4 text-primary" />
        Add more details
      </span>
      <MousePointer2 className="absolute left-44 top-40 h-7 w-7 fill-foreground text-background drop-shadow" />
    </div>
  )
}

function ApiDecoration() {
  return (
    <div aria-hidden="true" className="relative flex h-56 items-center justify-center overflow-hidden bg-muted">
      <div className="absolute h-36 w-36 rounded-full border border-foreground/10" />
      <div className="absolute h-24 w-24 rounded-full border border-foreground/15" />
      <div className="absolute h-px w-52 rotate-45 bg-foreground/10" />
      <div className="absolute h-px w-52 -rotate-45 bg-foreground/10" />
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-card text-card-foreground shadow-xl">
        <Share2 className="h-9 w-9 text-primary" />
      </div>
      <span className="absolute left-10 top-9 h-4 w-4 rounded-full bg-primary shadow-lg" />
      <span className="absolute bottom-10 right-12 h-5 w-5 rounded-full bg-foreground shadow-lg" />
      <span className="absolute right-9 top-12 h-3 w-3 rounded-full bg-muted-foreground shadow-lg" />
    </div>
  )
}

function LibraryDecoration() {
  return (
    <div aria-hidden="true" className="relative flex h-56 items-center justify-center overflow-hidden bg-muted">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--foreground)_1px,transparent_1px)] bg-[size:24px_24px] opacity-[0.04]" />
      <Folder className="h-24 w-24 fill-primary text-primary drop-shadow" />
      <span className="absolute bottom-8 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-caption text-card-foreground shadow-lg">
        <Search className="h-4 w-4" />
        Search in library
      </span>
    </div>
  )
}

export function FeatureCard({ variant, title, body }: FeatureCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl bg-card font-body text-card-foreground shadow-xl">
      {variant === 'prompt' ? <PromptDecoration /> : variant === 'api' ? <ApiDecoration /> : <LibraryDecoration />}
      <div className="p-7">
        <h3 className="font-display text-2xl font-semibold tracking-tight">{title}</h3>
        {body ? <p className="mt-3 text-body-token text-muted-foreground">{body}</p> : null}
      </div>
    </article>
  )
}

export function FeatureGrid({ badge, title, subtitle, cards }: FeatureGridProps & { cards: FeatureCardProps[] }) {
  return (
    <section className="bg-background px-6 py-24 font-body text-foreground md:px-12">
      <div className="mx-auto max-w-6xl text-center">
        {badge ? (
          <p className="bg-gradient-to-r from-primary via-foreground to-muted-foreground bg-clip-text text-caption font-semibold uppercase tracking-widest text-transparent">
            {badge}
          </p>
        ) : null}
        <h2 className="mt-3 font-display text-heading tracking-tight">{title}</h2>
        {subtitle ? <p className="mx-auto mt-4 max-w-2xl text-body-token text-muted-foreground">{subtitle}</p> : null}
        <div className="mt-12 grid gap-6 min-[601px]:grid-cols-2 min-[901px]:grid-cols-3">
          {cards.map((card, index) => <FeatureCard key={`${card.variant}-${card.title}-${index}`} {...card} />)}
        </div>
      </div>
    </section>
  )
}
