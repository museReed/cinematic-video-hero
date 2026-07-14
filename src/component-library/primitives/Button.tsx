import React, { type ReactNode } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
export type SafeHref = `https://${string}` | `#${string}` | `/${string}`

export type ButtonProps = {
  variant?: ButtonVariant
  href?: SafeHref
  children: ReactNode
  disabled?: boolean
}

const baseClassName =
  'inline-flex select-none items-center justify-center rounded-full px-6 py-3 font-body text-body-token font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50'

const variantClassNames: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-[var(--shadow-button-primary)]',
  secondary: 'bg-card text-card-foreground shadow-[var(--shadow-button-secondary)]',
  tertiary: 'bg-card text-card-foreground shadow-[var(--shadow-button-tertiary)]',
}

export function Button({ variant = 'primary', href, children, disabled = false }: ButtonProps) {
  const className = `${baseClassName} ${variantClassNames[variant]}`

  if (href) {
    const external = href.startsWith('https://')
    return (
      <a
        href={href}
        rel={external ? 'noopener noreferrer' : undefined}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (event) => event.preventDefault() : undefined}
        className={className}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" disabled={disabled} className={className}>
      {children}
    </button>
  )
}
