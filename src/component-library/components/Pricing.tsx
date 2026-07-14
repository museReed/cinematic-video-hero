import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PricingCardProps } from '../schemas'

export function PricingCard({ title, price, unit, features, dark, ctaLabel }: PricingCardProps) {
  return (
    <article
      className="flex min-h-[520px] flex-col rounded-[40px] p-8 md:p-10"
      style={{
        backgroundColor: dark ? 'var(--ck-color-dark-surface)' : 'var(--ck-color-surface)',
        boxShadow: dark ? undefined : '0 10px 50px color-mix(in srgb, var(--ck-color-ink) 10%, transparent)',
        color: dark ? 'var(--ck-color-dark-ink)' : 'var(--ck-color-text)',
        fontFamily: 'var(--ck-font-body)',
      }}
    >
      <h3 className="text-2xl font-semibold">{title}</h3>
      <ul className="mt-10 space-y-4">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed">
            <Check size={17} className="mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-12">
        <p className="text-5xl" style={{ fontFamily: 'var(--ck-font-display)' }}>{price}</p>
        <p className="mt-1 text-sm opacity-60">{unit}</p>
        <span
          className="mt-7 inline-flex rounded-full px-5 py-3 text-sm font-medium"
          style={{
            backgroundColor: dark ? 'var(--ck-color-dark-ink)' : 'var(--ck-color-accent)',
            color: dark ? 'var(--ck-color-dark-surface)' : 'var(--ck-color-accent-contrast)',
          }}
        >
          {ctaLabel}
        </span>
      </div>
    </article>
  )
}

export function PricingSection({ heading, cards }: { heading: string; cards: PricingCardProps[] }) {
  return (
    <section className="px-6 py-24 md:px-12" style={{ backgroundColor: 'var(--ck-color-bg)', color: 'var(--ck-color-text)', fontFamily: 'var(--ck-font-body)' }}>
      <h2 className="mx-auto mb-12 max-w-6xl text-5xl md:text-7xl" style={{ fontFamily: 'var(--ck-font-display)' }}>{heading}</h2>
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {cards.map((card, index) => (
          <motion.div key={`${card.title}-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (index + 1) * 0.1 }}>
            <PricingCard {...card} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
