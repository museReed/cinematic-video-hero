import { z } from 'zod/v3'
import type { PageSpec } from '../../src/page-builder/PageSpec'
import { validatePageSpec } from '../../src/page-builder/validatePageSpec'
import { pageNameSchema, readPage, writePage } from './pageStore'

const childSchema = z
  .object({
    component: z.string(),
    props: z.record(z.unknown()),
  })
  .strict()

const sectionSchema = z
  .object({
    id: z.string(),
    component: z.string(),
    props: z.record(z.unknown()),
    children: z.array(childSchema).optional(),
  })
  .strict()

export const updateOperationSchema = z.discriminatedUnion('op', [
  z.object({ op: z.literal('replaceProps'), sectionId: z.string(), props: z.record(z.unknown()) }).strict(),
  z.object({ op: z.literal('addSection'), section: sectionSchema, index: z.number().int().nonnegative().optional() }).strict(),
  z.object({ op: z.literal('removeSection'), sectionId: z.string() }).strict(),
  z.object({ op: z.literal('moveSection'), sectionId: z.string(), toIndex: z.number().int().nonnegative() }).strict(),
  z.object({ op: z.literal('setChildren'), sectionId: z.string(), children: z.array(childSchema) }).strict(),
  z.object({ op: z.literal('setTheme'), theme: z.enum(['studio', 'claude2code']) }).strict(),
])

export const updatePageInputSchema = z
  .object({
    name: pageNameSchema,
    ops: z.array(updateOperationSchema).min(1).max(20),
  })
  .strict()

type UpdateOperation = z.infer<typeof updateOperationSchema>

function stepError(index: number, message: string) {
  return { ok: false as const, errors: [`ops.${index}: ${message}`] }
}

function findSectionIndex(spec: PageSpec, sectionId: string) {
  return spec.sections.findIndex((section) => section.id === sectionId)
}

function applyOperation(spec: PageSpec, operation: UpdateOperation, index: number) {
  if (operation.op === 'setTheme') {
    spec.theme = operation.theme
    return null
  }

  if (operation.op === 'addSection') {
    const insertAt = operation.index ?? spec.sections.length
    if (insertAt > spec.sections.length) return stepError(index, `index ${insertAt} is out of bounds`)
    spec.sections.splice(insertAt, 0, operation.section as PageSpec['sections'][number])
    return null
  }

  const sectionIndex = findSectionIndex(spec, operation.sectionId)
  if (sectionIndex === -1) return stepError(index, `Section ${operation.sectionId} does not exist`)

  if (operation.op === 'replaceProps') {
    spec.sections[sectionIndex].props = operation.props
  } else if (operation.op === 'removeSection') {
    spec.sections.splice(sectionIndex, 1)
  } else if (operation.op === 'moveSection') {
    if (operation.toIndex >= spec.sections.length) return stepError(index, `toIndex ${operation.toIndex} is out of bounds`)
    const [section] = spec.sections.splice(sectionIndex, 1)
    spec.sections.splice(operation.toIndex, 0, section)
  } else {
    spec.sections[sectionIndex].children = operation.children as PageSpec['sections'][number]['children']
  }

  return null
}

export async function updatePage(input: z.infer<typeof updatePageInputSchema>) {
  const current = await readPage(input.name)
  if (!current.ok) return current

  const currentValidation = validatePageSpec(current.spec)
  if (!currentValidation.ok) return currentValidation

  const nextSpec = JSON.parse(JSON.stringify(currentValidation.spec)) as PageSpec
  for (const [index, operation] of input.ops.entries()) {
    const error = applyOperation(nextSpec, operation, index)
    if (error) return error
  }

  const validation = validatePageSpec(nextSpec)
  if (!validation.ok) return validation

  const writeResult = await writePage(input.name, validation.spec, true)
  if (!writeResult.ok) return writeResult

  return {
    ok: true as const,
    applied: input.ops.length,
    sectionCount: writeResult.spec.sections.length,
  }
}
