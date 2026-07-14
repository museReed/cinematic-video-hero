import { z } from 'zod/v3'
import { validatePageSpec } from '../../src/page-builder/validatePageSpec'
import { pageNameSchema, readPage } from './pageStore'

export const validatePageInputSchema = z
  .object({
    name: pageNameSchema.optional(),
    spec: z.unknown().optional(),
  })
  .strict()
  .refine((input) => (input.name === undefined) !== (input.spec === undefined), {
    message: 'Provide exactly one of name or spec',
  })

export async function validatePage(input: z.infer<typeof validatePageInputSchema>) {
  if (input.name !== undefined) {
    const page = await readPage(input.name)
    if (!page.ok) return page
    return validatePageSpec(page.spec)
  }

  return validatePageSpec(input.spec)
}
