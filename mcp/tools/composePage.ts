import { z } from 'zod/v3'
import { pageExists, pageNameSchema, resolvePagePath, writePage } from './pageStore'

export const composePageInputSchema = z
  .object({
    name: pageNameSchema,
    spec: z.unknown(),
    overwrite: z.boolean().optional(),
  })
  .strict()

export async function composePage(input: z.infer<typeof composePageInputSchema>) {
  const pathResult = resolvePagePath(input.name)
  if (!pathResult.ok) return pathResult

  const exists = await pageExists(pathResult.path)
  if (exists && input.overwrite !== true) {
    return { ok: false as const, errors: [`page: ${input.name} already exists`] }
  }

  const writeResult = await writePage(input.name, input.spec, input.overwrite === true)
  if (!writeResult.ok) return writeResult

  return {
    ok: true as const,
    path: writeResult.path,
    sectionCount: writeResult.spec.sections.length,
  }
}
