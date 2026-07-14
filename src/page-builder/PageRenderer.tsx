import { createElement, useEffect, type ComponentType, type CSSProperties } from 'react'
import { componentRegistry } from '../component-library/registry'
import type { PricingCardProps } from '../component-library/schemas'
import { THEMES, THEME_FONT_CSS_URLS } from '../component-library/tokens'
import type { PageSpec } from './PageSpec'
import { validatePageSpec } from './validatePageSpec'

function useThemeFonts(theme: PageSpec['theme']) {
  useEffect(() => {
    const links = THEME_FONT_CSS_URLS[theme].map((href) => {
      const existing = document.head.querySelector(`link[data-ck-theme-font="${href}"]`)
      if (existing) return null
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.dataset.ckThemeFont = href
      document.head.appendChild(link)
      return link
    })
    return () => { links.forEach((link) => link?.remove()) }
  }, [theme])
}

export function PageRenderer({ spec }: { spec: PageSpec }) {
  const result = validatePageSpec(spec)
  if (!result.ok) throw new Error(`PageRenderer received an invalid PageSpec: ${result.errors.join('; ')}`)

  useThemeFonts(result.spec.theme)

  return (
    <main style={THEMES[result.spec.theme] as CSSProperties}>
      {result.spec.sections.map((section) => {
        const entry = componentRegistry[section.component]
        const Component = entry.component as ComponentType<Record<string, unknown>>
        const props = section.props as Record<string, unknown>

        if (section.component === 'studio.pricing') {
          const cards = section.children?.map((child) => child.props as PricingCardProps) ?? []
          return createElement(Component, { key: section.id, ...props, cards })
        }

        return createElement(Component, { key: section.id, ...props })
      })}
    </main>
  )
}
