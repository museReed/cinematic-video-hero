import { z } from 'zod/v3'
import { IMAGE_PATH_PREFIXES, VIDEO_DOMAIN_ALLOWLIST } from './tokens'

export const allowedVideoUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value)
    return url.protocol === 'https:' && VIDEO_DOMAIN_ALLOWLIST.includes(url.hostname as (typeof VIDEO_DOMAIN_ALLOWLIST)[number])
  }, 'Video URL must use HTTPS and an allowed hostname')

export const allowedImagePathSchema = z
  .string()
  .refine(
    (value) =>
      !value.includes('..') &&
      !/^[a-z][a-z\d+.-]*:/i.test(value) &&
      IMAGE_PATH_PREFIXES.some((prefix) => value.startsWith(prefix)),
    'Image path must use an allowed local prefix without a protocol or ..',
  )

export const safeHrefSchema = z.union([
  z
    .string()
    .url()
    .refine((value) => URL.canParse(value) && new URL(value).protocol === 'https:', 'External links must use HTTPS'),
  z
    .string()
    .refine(
      (value) => value.startsWith('#') || (value.startsWith('/') && !value.startsWith('//')),
      'Link must be an HTTPS URL, anchor, or local path',
    ),
])

export const heroPropsSchema = z
  .object({
    eyebrow: z.string().max(40),
    title: z.string().max(80),
    body: z.string().max(200).optional(),
    ctaLabel: z.string().max(24).optional(),
    layout: z.enum(['cinematic', 'editorial']).default('cinematic'),
  })
  .strict()

export const fullBleedVideoPropsSchema = z
  .object({
    src: allowedVideoUrlSchema,
    caption: z.string().max(80).optional(),
    focalY: z.number().int().min(-30).max(40).default(0),
    interaction: z.enum(['none', 'scrub']).default('none'),
    fallback: z.enum(['radial-glow', 'solid']).default('radial-glow'),
  })
  .strict()

export const carouselImageSchema = z
  .object({
    src: allowedImagePathSchema,
    bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Background must be a #RRGGBB hex color'),
  })
  .strict()

export const depthCarouselPropsSchema = z
  .object({
    title: z.string().max(40),
    images: z.tuple([carouselImageSchema, carouselImageSchema, carouselImageSchema, carouselImageSchema]),
    autoAdvanceMs: z.number().int().min(2000).max(10000).optional(),
  })
  .strict()

export const marqueePropsSchema = z.discriminatedUnion('content', [
  z
    .object({
      content: z.literal('text'),
      text: z.string().max(60),
      speed: z.enum(['slow', 'normal', 'fast']),
      rows: z.union([z.literal(1), z.literal(2)]).default(2),
    })
    .strict(),
  z
    .object({
      content: z.literal('gif-rail'),
      items: z.array(allowedImagePathSchema).min(2).max(12),
      speed: z.enum(['slow', 'normal', 'fast']),
    })
    .strict(),
])

const footerLinkSchema = z
  .object({
    label: z.string().max(24),
    href: safeHrefSchema,
  })
  .strict()

const footerColumnSchema = z
  .object({
    heading: z.string().max(24),
    links: z.array(footerLinkSchema).min(1).max(6),
  })
  .strict()

export const footerPropsSchema = z
  .object({
    ctaLabel: z.string().max(24),
    columns: z.array(footerColumnSchema).min(1).max(3),
    company: z.string().max(40),
    location: z.string().max(40),
    bottomCtaLabel: z.string().max(24),
  })
  .strict()

export const pricingPropsSchema = z
  .object({
    heading: z.string().max(60),
  })
  .strict()

export const pricingCardPropsSchema = z
  .object({
    title: z.string().max(40),
    price: z.string().max(16),
    unit: z.string().max(24),
    features: z.array(z.string().max(60)).min(1).max(6),
    dark: z.boolean(),
    ctaLabel: z.string().max(24),
  })
  .strict()

export type HeroProps = z.input<typeof heroPropsSchema>
export type FullBleedVideoProps = z.input<typeof fullBleedVideoPropsSchema>
export type DepthCarouselProps = z.infer<typeof depthCarouselPropsSchema>
export type MarqueeProps = z.input<typeof marqueePropsSchema>
export type FooterProps = z.infer<typeof footerPropsSchema>
export type PricingCardProps = z.infer<typeof pricingCardPropsSchema>
