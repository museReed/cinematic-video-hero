import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PricingCardProps } from '../schemas'
import { MOTION } from '../themes'

export function PricingCard({ title, price, unit, features, dark, ctaLabel }: PricingCardProps) {
  return (
    <article
      className={`flex min-h-[520px] flex-col rounded-[40px] p-8 font-body md:p-10 ${dark ? 'bg-inverted text-inverted-foreground' : 'bg-card text-card-foreground shadow-xl'}`}
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <ul className="mt-10 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-body-token">
            <Check size={17} className="mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-12">
        <p className="font-display text-heading">{price}</p>
        <p className="mt-1 text-caption opacity-60">{unit}</p>
        <span className="mt-7 inline-flex rounded-full bg-primary px-5 py-3 text-body-token font-medium text-primary-foreground">
          {ctaLabel}
        </span>
      </div>
    </article>
  )
}

export function PricingSection({ heading, cards }: { heading: string; cards: PricingCardProps[] }) {
  return (
    <section className="bg-background px-6 py-24 font-body text-foreground md:px-12">
      <h2 className="mx-auto mb-12 max-w-6xl font-display text-heading">{heading}</h2>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {cards.map((card, index) => (
          <motion.div
            key={`${card.title}-${index}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index + 1) * MOTION.staggerStep }}
          >
            <PricingCard {...card} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
