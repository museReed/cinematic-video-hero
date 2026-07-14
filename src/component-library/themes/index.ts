import claude2codeDesignTokens from './claude2code.design-tokens.json'

export type ThemeId = 'studio' | 'claude2code'

export const MOTION = {
  durationBase: 0.7,
  durationSlow: 0.65,
  staggerStep: 0.1,
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeLinear: 'linear',
} as const

export const THEME_VARIABLES = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--muted',
  '--muted-foreground',
  '--primary',
  '--primary-foreground',
  '--inverted',
  '--inverted-foreground',
  '--font-display',
  '--font-body',
  '--fs-display',
  '--fs-heading',
  '--fs-body',
  '--fs-caption',
  '--motion-duration-base',
  '--motion-duration-slow',
  '--motion-stagger-step',
  '--motion-ease-standard',
  '--motion-ease-linear',
] as const

type Theme = Record<(typeof THEME_VARIABLES)[number], string>

const primitive = claude2codeDesignTokens.primitive as Record<string, Record<string, string>>

function resolveColor(value: string) {
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value

  const [palette, step, extra] = value.split('.')
  const resolved = extra === undefined ? primitive[palette]?.[step] : undefined
  if (!resolved || !/^#[0-9A-Fa-f]{6}$/.test(resolved)) {
    throw new Error(`Unable to resolve claude2code color token: ${value}`)
  }

  return resolved
}

const studio: Theme = {
  '--background': '#F6FCFF',
  '--foreground': '#051A24',
  '--card': '#FFFFFF',
  '--card-foreground': '#0D212C',
  '--muted': '#E0EBF0',
  '--muted-foreground': '#0D212C',
  '--primary': '#051A24',
  '--primary-foreground': '#FFFFFF',
  '--inverted': '#000000',
  '--inverted-foreground': '#FFFFFF',
  '--font-display': "'Instrument Serif', serif",
  '--font-body': "Inter, ui-sans-serif, system-ui, sans-serif",
  '--fs-display': 'clamp(3rem, 7vw, 7rem)',
  '--fs-heading': 'clamp(2.25rem, 4vw, 4rem)',
  '--fs-body': '1rem',
  '--fs-caption': '0.75rem',
  '--motion-duration-base': `${MOTION.durationBase * 1000}ms`,
  '--motion-duration-slow': `${MOTION.durationSlow * 1000}ms`,
  '--motion-stagger-step': `${MOTION.staggerStep * 1000}ms`,
  '--motion-ease-standard': MOTION.easeStandard,
  '--motion-ease-linear': MOTION.easeLinear,
}

const claude2code: Theme = {
  '--background': resolveColor(claude2codeDesignTokens.semantic.color.bg),
  '--foreground': resolveColor(claude2codeDesignTokens.semantic.color['text-strong']),
  '--card': resolveColor(claude2codeDesignTokens.semantic.color['bg-elevated']),
  '--card-foreground': resolveColor(claude2codeDesignTokens.semantic.color.text),
  '--muted': resolveColor(claude2codeDesignTokens.semantic.color['bg-inset']),
  '--muted-foreground': resolveColor(claude2codeDesignTokens.semantic.color['text-muted']),
  '--primary': resolveColor(claude2codeDesignTokens.semantic.color.accent),
  '--primary-foreground': resolveColor('neutral.1'),
  '--inverted': resolveColor(claude2codeDesignTokens.semantic.terminal.bg),
  '--inverted-foreground': resolveColor(claude2codeDesignTokens.semantic.terminal.ink),
  '--font-display': claude2codeDesignTokens.font.serif,
  '--font-body': claude2codeDesignTokens.font.sans,
  '--fs-display': 'clamp(2.25rem, 5vw, 4.5rem)',
  '--fs-heading': 'clamp(1.75rem, 3vw, 2.75rem)',
  '--fs-body': '0.9375rem',
  '--fs-caption': '0.8125rem',
  '--motion-duration-base': `${MOTION.durationBase * 1000}ms`,
  '--motion-duration-slow': `${MOTION.durationSlow * 1000}ms`,
  '--motion-stagger-step': `${MOTION.staggerStep * 1000}ms`,
  '--motion-ease-standard': MOTION.easeStandard,
  '--motion-ease-linear': MOTION.easeLinear,
}

export const THEMES: Record<ThemeId, Theme> = {
  studio,
  claude2code,
}

export function buildThemeCss() {
  return Object.entries(THEMES)
    .map(
      ([theme, variables]) =>
        `[data-theme='${theme}'] {\n${THEME_VARIABLES.map((variable) => `  ${variable}: ${variables[variable]};`).join('\n')}\n}`,
    )
    .join('\n\n')
}

/** Webfont stylesheets each theme depends on; PageRenderer injects these on mount. */
export const THEME_FONT_CSS_URLS: Record<ThemeId, string[]> = {
  // studio fonts are self-hosted via @font-face in src/index.css — no external stylesheet needed.
  studio: [],
  claude2code: [
    'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap',
  ],
}
