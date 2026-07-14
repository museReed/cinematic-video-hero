import { z } from 'zod/v3'
import { allowedImagePathSchema } from '../component-library/schemas'

// section-scope (寫法 A)
export const inviewEntrancePropsSchema = z
  .object({
    delay: z.number().min(0).max(2).optional(),
    x: z.number().min(-200).max(200).optional(),
    y: z.number().min(-200).max(200).optional(),
    duration: z.number().min(0.1).max(2).optional(),
  })
  .strict()

export const pointerMagnetPropsSchema = z
  .object({
    strength: z.number().min(1).max(10).optional(),
    radiusPx: z.number().int().min(40).max(400).optional(),
  })
  .strict()

// page-scope (寫法 C)
export const pointerOverlayPropsSchema = z
  .object({
    variant: z.enum(['cursor', 'trail']),
    items: z.array(allowedImagePathSchema).min(1).max(12).optional(),
  })
  .strict()

export const scrollDirectorPropsSchema = z
  .object({
    phases: z
      .array(z.enum(['intro', 'archive', 'exit']))
      .min(1)
      .max(3)
      .optional(),
  })
  .strict()

export type InviewEntranceProps = z.infer<typeof inviewEntrancePropsSchema>
export type PointerMagnetProps = z.infer<typeof pointerMagnetPropsSchema>
export type PointerOverlayProps = z.infer<typeof pointerOverlayPropsSchema>
export type ScrollDirectorProps = z.infer<typeof scrollDirectorPropsSchema>
