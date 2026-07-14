import { ArrowUpRight } from 'lucide-react'
import type { FooterProps } from '../schemas'

export function Footer({ ctaLabel, columns, company, location, bottomCtaLabel }: FooterProps) {
  return (
    <footer className="relative min-h-screen bg-background px-6 py-16 font-body text-foreground md:px-12 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 md:flex-row md:items-start md:justify-between">
        <span className="inline-flex w-fit rounded-full bg-primary px-6 py-3 text-caption font-medium text-primary-foreground">{ctaLabel}</span>
        <nav aria-label="Footer" className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className="text-caption uppercase tracking-widest text-muted-foreground">{column.heading}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => {
                  const external = link.href.toLowerCase().startsWith('https://')
                  return (
                    <li key={`${link.label}-${link.href}`}>
                      <a
                        href={link.href}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center gap-1 text-body-token hover:text-muted-foreground"
                      >
                        {link.label}
                        {external ? <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="absolute bottom-8 left-6 right-6 flex flex-col gap-2 border-t border-foreground/10 pt-5 text-caption text-muted-foreground sm:flex-row sm:justify-between md:left-12 md:right-12">
        <span>{company}</span>
        <span>{location}</span>
      </div>
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-card px-3 py-2 text-card-foreground shadow-lg">
        <span className="font-display text-heading" aria-hidden="true">
          {company.charAt(0)}
        </span>
        <span className="rounded-full bg-primary px-4 py-2 text-caption text-primary-foreground">{bottomCtaLabel}</span>
      </div>
    </footer>
  )
}
