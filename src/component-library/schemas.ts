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

const testimonialItemSchema = z
  .object({
    quote: z.string().max(200),
    author: z.string().max(40),
    company: z.string().max(40),
  })
  .strict()

export const testimonialCarouselPropsSchema = z
  .object({
    items: z.array(testimonialItemSchema).min(2).max(8),
    autoAdvanceMs: z.number().int().min(2000).max(8000).default(3000),
    cardWidth: z.number().int().min(240).max(600).optional(),
  })
  .strict()

const deadZoneSchema = z
  .object({
    left: z.number().min(0).max(1),
    right: z.number().min(0).max(1),
  })
  .strict()
  .refine(({ left, right }) => left < right, { message: 'Dead zone left must be less than right' })

export const splitVideoScrubPropsSchema = z
  .object({
    left: allowedVideoUrlSchema,
    right: allowedVideoUrlSchema,
    mode: z.enum(['independent', 'dead-zone']).default('independent'),
    deadZone: deadZoneSchema.optional(),
  })
  .strict()
  .refine(({ mode, deadZone }) => mode === 'dead-zone' || deadZone === undefined, {
    message: 'Dead zone thresholds are only valid in dead-zone mode',
    path: ['deadZone'],
  })

const masonryItemSchema = z
  .object({
    src: allowedImagePathSchema,
    aspect: z.number().min(0.3).max(3),
  })
  .strict()

const masonryColumnsSchema = z
  .object({
    mobile: z.union([z.literal(1), z.literal(2)]).default(2),
    desktop: z.union([z.literal(2), z.literal(3), z.literal(4)]).default(3),
  })
  .strict()

export const masonryGridPropsSchema = z
  .object({
    items: z.array(masonryItemSchema).min(2).max(24),
    columns: masonryColumnsSchema.optional(),
  })
  .strict()

export const quoteParallaxPropsSchema = z
  .object({
    quote: z.string().max(200),
    author: z.string().max(40),
    companies: z.array(z.string().max(40)).max(3).optional(),
    portrait: allowedImagePathSchema,
  })
  .strict()

const scrollCardItemSchema = z
  .object({
    title: z.string().max(40),
    body: z.string().max(160).optional(),
    image: allowedImagePathSchema.optional(),
  })
  .strict()

const scaleRangeSchema = z
  .object({
    min: z.number().min(0.7).max(0.99).default(0.88),
  })
  .strict()

export const scrollScaleCardsPropsSchema = z
  .object({
    items: z.array(scrollCardItemSchema).min(2).max(8),
    scaleRange: scaleRangeSchema.optional(),
  })
  .strict()

export const stickyCardStackPropsSchema = z
  .object({
    items: z.array(scrollCardItemSchema).min(2).max(8),
    offsetPx: z.number().int().min(0).max(64).default(28),
  })
  .strict()

const projectStackItemSchema = z
  .object({
    name: z.string().max(40),
    description: z.string().max(160),
    image: allowedImagePathSchema,
  })
  .strict()

export const projectStackPropsSchema = z
  .object({
    items: z.array(projectStackItemSchema).min(2).max(8),
  })
  .strict()

export const scrollCharacterRevealPropsSchema = z
  .object({
    text: z.string().max(400),
  })
  .strict()

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a #RRGGBB hex value')

export const gradientHeadingPropsSchema = z
  .object({
    text: z.string().max(60),
    from: hexColorSchema.optional(),
    to: hexColorSchema.optional(),
  })
  .strict()

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
export type TestimonialCarouselProps = z.input<typeof testimonialCarouselPropsSchema>
export type SplitVideoScrubProps = z.input<typeof splitVideoScrubPropsSchema>
export type MasonryGridProps = z.input<typeof masonryGridPropsSchema>
export type QuoteParallaxProps = z.infer<typeof quoteParallaxPropsSchema>
export type ScrollScaleCardsProps = z.input<typeof scrollScaleCardsPropsSchema>
export type StickyCardStackProps = z.input<typeof stickyCardStackPropsSchema>
export type ProjectStackProps = z.infer<typeof projectStackPropsSchema>
export type ScrollCharacterRevealProps = z.infer<typeof scrollCharacterRevealPropsSchema>
export type GradientHeadingProps = z.infer<typeof gradientHeadingPropsSchema>
export type FooterProps = z.infer<typeof footerPropsSchema>
export type PricingCardProps = z.infer<typeof pricingCardPropsSchema>
