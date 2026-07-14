import { z } from 'zod/v3'
import { IMAGE_PATH_PREFIXES, VIDEO_DOMAIN_ALLOWLIST } from './tokens'

const allowedVideoUrlSchema = z
  .string()
  .url()
  .refine((value) => {
    const url = new URL(value)
    return url.protocol === 'https:' && VIDEO_DOMAIN_ALLOWLIST.includes(url.hostname as (typeof VIDEO_DOMAIN_ALLOWLIST)[number])
  }, 'Video URL must use HTTPS and an allowed hostname')

const allowedImagePathSchema = z
  .string()
  .refine(
    (value) =>
      !value.includes('..') &&
      !/^[a-z][a-z\d+.-]*:/i.test(value) &&
      IMAGE_PATH_PREFIXES.some((prefix) => value.startsWith(prefix)),
    'Image path must use an allowed local prefix without a protocol or ..',
  )

export const heroRevealPropsSchema = z
  .object({
    eyebrow: z.string().max(40),
    title: z.string().max(80),
    ctaLabel: z.string().max(24).optional(),
  })
  .strict()

export const videoLoopPropsSchema = z
  .object({
    src: allowedVideoUrlSchema,
    caption: z.string().max(80).optional(),
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

export const scrollMarqueePropsSchema = z
  .object({
    text: z.string().max(60),
    repeat: z.number().int().min(2).max(8),
    speed: z.enum(['slow', 'normal', 'fast']),
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

export type HeroRevealProps = z.infer<typeof heroRevealPropsSchema>
export type VideoLoopProps = z.infer<typeof videoLoopPropsSchema>
export type DepthCarouselProps = z.infer<typeof depthCarouselPropsSchema>
export type ScrollMarqueeProps = z.infer<typeof scrollMarqueePropsSchema>
export type PricingCardProps = z.infer<typeof pricingCardPropsSchema>
