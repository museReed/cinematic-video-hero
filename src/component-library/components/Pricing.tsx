import { Check } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PricingCardProps } from '../schemas'
import { THEME_TOKENS } from '../tokens'

export function PricingCard({ title, price, unit, features, dark, ctaLabel }: PricingCardProps) {
  return (
    <article
      className={`flex min-h-[520px] flex-col rounded-[40px] p-8 md:p-10 ${dark ? 'text-[#F6FCFF]' : 'shadow-[0_10px_50px_rgba(5,26,36,.10)]'}`}
      style={{ backgroundColor: dark ? THEME_TOKENS.colors.ink : THEME_TOKENS.colors.paper, color: dark ? THEME_TOKENS.colors.mist : THEME_TOKENS.colors.text }}
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
        <p className="text-5xl" style={{ fontFamily: THEME_TOKENS.fonts.display }}>{price}</p>
        <p className="mt-1 text-sm opacity-60">{unit}</p>
        <span className={`mt-7 inline-flex rounded-full px-5 py-3 text-sm font-medium ${dark ? 'bg-white text-[#051A24]' : 'bg-[#051A24] text-white'}`}>{ctaLabel}</span>
      </div>
    </article>
  )
}

export function PricingSection({ heading, cards }: { heading: string; cards: PricingCardProps[] }) {
  return (
    <section className="bg-white px-6 py-24 md:px-12" style={{ fontFamily: THEME_TOKENS.fonts.body, color: THEME_TOKENS.colors.text }}>
      <h2 className="mx-auto mb-12 max-w-6xl text-5xl md:text-7xl" style={{ fontFamily: THEME_TOKENS.fonts.display }}>{heading}</h2>
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
