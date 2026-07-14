import { z } from 'zod/v3'
import { behaviorRegistry, type BehaviorId } from '../behavior-library/registry'
import { componentRegistry, type ComponentId } from '../component-library/registry'
import type { PageSpec } from './PageSpec'

const childSchema = z
  .object({
    component: z.string(),
    props: z.record(z.unknown()),
  })
  .strict()

const behaviorSchema = z
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
    enhancements: z.array(behaviorSchema).min(1).max(4).optional(),
  })
  .strict()

const pageSpecSchema = z
  .object({
    version: z.literal(1),
    theme: z.enum(['studio', 'claude2code']),
    sections: z.array(sectionSchema).min(1).max(10),
    behaviors: z.array(behaviorSchema).min(1).max(4).optional(),
  })
  .strict()

function isComponentId(value: string): value is ComponentId {
  return Object.prototype.hasOwnProperty.call(componentRegistry, value)
}

function isBehaviorId(value: string): value is BehaviorId {
  return Object.prototype.hasOwnProperty.call(behaviorRegistry, value)
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

    // 寫法 A — section-scope enhancements must be registered section behaviors on this section's allowlist.
    if (section.enhancements) {
      const allowedEnhancements = entry.allowedEnhancements as readonly string[]
      const seenEnhancements = new Set<string>()
      section.enhancements.forEach((enhancement, enhancementIndex) => {
        const enhancementPath = `${sectionPath}.enhancements.${enhancementIndex}`
        if (!isBehaviorId(enhancement.component)) {
          errors.push(`${enhancementPath}.component: Unknown behavior ${enhancement.component}`)
          return
        }
        const behavior = behaviorRegistry[enhancement.component]
        if (behavior.scope !== 'section') {
          errors.push(`${enhancementPath}.component: ${enhancement.component} is a page-scope behavior and cannot enhance a section`)
        } else if (!allowedEnhancements.includes(enhancement.component)) {
          errors.push(`${enhancementPath}.component: ${enhancement.component} is not an allowed enhancement of ${section.component}`)
        }
        if (seenEnhancements.has(enhancement.component)) {
          errors.push(`${enhancementPath}.component: Duplicate enhancement ${enhancement.component}`)
        }
        seenEnhancements.add(enhancement.component)

        const enhancementPropsResult = behavior.propsSchema.safeParse(enhancement.props)
        if (!enhancementPropsResult.success) {
          errors.push(...enhancementPropsResult.error.issues.map((issue) => issueText([enhancementPath, 'props', ...issue.path], issue.message)))
        }
      })
    }
  })

  // 寫法 C — page-scope behaviors must be registered page behaviors, applied at most once each.
  if (baseResult.data.behaviors) {
    const seenBehaviors = new Set<string>()
    baseResult.data.behaviors.forEach((behavior, behaviorIndex) => {
      const behaviorPath = `behaviors.${behaviorIndex}`
      if (!isBehaviorId(behavior.component)) {
        errors.push(`${behaviorPath}.component: Unknown behavior ${behavior.component}`)
        return
      }
      const entry = behaviorRegistry[behavior.component]
      if (entry.scope !== 'page') {
        errors.push(`${behaviorPath}.component: ${behavior.component} is a section-scope behavior and cannot apply to the page`)
      }
      if (seenBehaviors.has(behavior.component)) {
        errors.push(`${behaviorPath}.component: Duplicate page behavior ${behavior.component}`)
      }
      seenBehaviors.add(behavior.component)

      const behaviorPropsResult = entry.propsSchema.safeParse(behavior.props)
      if (!behaviorPropsResult.success) {
        errors.push(...behaviorPropsResult.error.issues.map((issue) => issueText([behaviorPath, 'props', ...issue.path], issue.message)))
      }
    })
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, spec: baseResult.data as PageSpec }
}
