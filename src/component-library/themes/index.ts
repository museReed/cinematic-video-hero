import claude2codeDesignTokens from './claude2code.design-tokens.json'

export type ThemeId = 'studio' | 'claude2code'

export const THEME_VARIABLES = [
  '--ck-color-bg',
  '--ck-color-surface',
  '--ck-color-ink',
  '--ck-color-text',
  '--ck-color-muted',
  '--ck-color-accent',
  '--ck-color-accent-contrast',
  '--ck-color-dark-surface',
  '--ck-color-dark-ink',
  '--ck-font-display',
  '--ck-font-body',
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
  '--ck-color-bg': '#F6FCFF',
  '--ck-color-surface': '#FFFFFF',
  '--ck-color-ink': '#051A24',
  '--ck-color-text': '#0D212C',
  '--ck-color-muted': '#E0EBF0',
  '--ck-color-accent': '#051A24',
  '--ck-color-accent-contrast': '#FFFFFF',
  '--ck-color-dark-surface': '#000000',
  '--ck-color-dark-ink': '#FFFFFF',
  '--ck-font-display': "'PP Mondwest', 'Instrument Serif', serif",
  '--ck-font-body': "'PP Neue Montreal', Inter, ui-sans-serif, system-ui, sans-serif",
}

const claude2code: Theme = {
  '--ck-color-bg': resolveColor(claude2codeDesignTokens.semantic.color.bg),
  '--ck-color-surface': resolveColor(claude2codeDesignTokens.semantic.color['bg-elevated']),
  '--ck-color-ink': resolveColor(claude2codeDesignTokens.semantic.color['text-strong']),
  '--ck-color-text': resolveColor(claude2codeDesignTokens.semantic.color.text),
  '--ck-color-muted': resolveColor(claude2codeDesignTokens.semantic.color['text-muted']),
  '--ck-color-accent': resolveColor(claude2codeDesignTokens.semantic.color.accent),
  '--ck-color-accent-contrast': resolveColor('neutral.1'),
  '--ck-color-dark-surface': resolveColor(claude2codeDesignTokens.semantic.terminal.bg),
  '--ck-color-dark-ink': resolveColor(claude2codeDesignTokens.semantic.terminal.ink),
  '--ck-font-display': claude2codeDesignTokens.font.serif,
  '--ck-font-body': claude2codeDesignTokens.font.sans,
}

export const THEMES: Record<ThemeId, Record<string, string>> = {
  studio,
  claude2code,
}
