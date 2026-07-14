import { z } from 'zod/v3'
import { componentRegistry, type ComponentId } from '../component-library/registry'
import type { PageSpec } from './PageSpec'

const childSchema = z
  .object({
    component: z.string(),
    props: z.record(z.unknown()),
  })
  .strict()

const sectionSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Section id must be a kebab-case slug'),
    component: z.string(),
    props: z.record(z.unknown()),
    children: z.array(childSchema).min(1).max(3).optional(),
  })
  .strict()

const pageSpecSchema = z
  .object({
    version: z.literal(1),
    theme: z.literal('spike'),
    sections: z.array(sectionSchema).min(1).max(10),
  })
  .strict()

function isComponentId(value: string): value is ComponentId {
  return Object.prototype.hasOwnProperty.call(componentRegistry, value)
}

function issueText(path: Array<string | number>, message: string) {
  return `${path.length > 0 ? path.join('.') : 'spec'}: ${message}`
}

export function validatePageSpec(spec: unknown): { ok: true; spec: PageSpec } | { ok: false; errors: string[] } {
  const baseResult = pageSpecSchema.safeParse(spec)
  if (!baseResult.success) {
    return { ok: false, errors: baseResult.error.issues.map((issue) => issueText(issue.path, issue.message)) }
  }

  const errors: string[] = []
  const seenIds = new Set<string>()

  baseResult.data.sections.forEach((section, sectionIndex) => {
    const sectionPath = `sections.${sectionIndex}`

    if (seenIds.has(section.id)) errors.push(`${sectionPath}.id: Section ids must be unique`)
    seenIds.add(section.id)

    if (!isComponentId(section.component)) {
      errors.push(`${sectionPath}.component: Unknown component ${section.component}`)
      return
    }

    const entry = componentRegistry[section.component]
    if (!entry.topLevel) errors.push(`${sectionPath}.component: ${section.component} is not allowed at the top level`)

    const propsResult = entry.propsSchema.safeParse(section.props)
    if (!propsResult.success) {
      errors.push(...propsResult.error.issues.map((issue) => issueText([sectionPath, 'props', ...issue.path], issue.message)))
    }

    if (section.children) {
      const allowedChildren = entry.allowedChildren as readonly string[]
      section.children.forEach((child, childIndex) => {
        const childPath = `${sectionPath}.children.${childIndex}`
        if (!isComponentId(child.component)) {
          errors.push(`${childPath}.component: Unknown component ${child.component}`)
          return
        }
        if (!allowedChildren.includes(child.component)) {
          errors.push(`${childPath}.component: ${child.component} is not an allowed child of ${section.component}`)
        }

        const childPropsResult = componentRegistry[child.component].propsSchema.safeParse(child.props)
        if (!childPropsResult.success) {
          errors.push(...childPropsResult.error.issues.map((issue) => issueText([childPath, 'props', ...issue.path], issue.message)))
        }
      })
    }
  })

  return errors.length > 0 ? { ok: false, errors } : { ok: true, spec: baseResult.data as PageSpec }
}
