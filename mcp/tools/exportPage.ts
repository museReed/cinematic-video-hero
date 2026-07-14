import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod/v3'
import type { ComponentId } from '../../src/component-library/registry'
import type { PageSpec } from '../../src/page-builder/PageSpec'
import { validatePageSpec } from '../../src/page-builder/validatePageSpec'
import { EXPORT_TEMPLATES } from './exportTemplates'
import { pageNameSchema, readPage } from './pageStore'

const EXPORTED_DIR = path.resolve(process.cwd(), 'exported-pages')

const componentImports: Record<ComponentId, { name: string; module: string }> = {
  'cinematic.hero-reveal': { name: 'HeroReveal', module: '../src/component-library/components/HeroReveal' },
  'cinematic.video-loop': { name: 'VideoLoop', module: '../src/component-library/components/VideoLoop' },
  'creator.depth-carousel': { name: 'DepthCarousel', module: '../src/component-library/components/DepthCarousel' },
  'creator.scroll-marquee': { name: 'ScrollMarquee', module: '../src/component-library/components/ScrollMarquee' },
  'studio.pricing': { name: 'PricingSection', module: '../src/component-library/components/Pricing' },
  'studio.pricing-card': { name: 'PricingCard', module: '../src/component-library/components/Pricing' },
}

export const exportPageInputSchema = z
  .object({
    name: pageNameSchema.optional(),
    spec: z.unknown().optional(),
  })
  .strict()
  .refine((input) => (input.name === undefined) !== (input.spec === undefined), {
    message: 'Provide exactly one of name or spec',
  })

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function resolveExportPath(name: string) {
  const nameResult = pageNameSchema.safeParse(name)
  if (!nameResult.success) {
    return { ok: false as const, errors: nameResult.error.issues.map((issue) => `name: ${issue.message}`) }
  }

  const exportPath = path.resolve(EXPORTED_DIR, `${nameResult.data}.tsx`)
  if (path.dirname(exportPath) !== EXPORTED_DIR) {
    return { ok: false as const, errors: ['name: Export path must stay inside exported-pages'] }
  }

  return { ok: true as const, path: exportPath }
}

function buildSource(spec: PageSpec) {
  const seenComponents = new Set<ComponentId>()
  const imports = spec.sections.flatMap((section) => {
    if (seenComponents.has(section.component)) return []
    seenComponents.add(section.component)
    const componentImport = componentImports[section.component]
    return [`import { ${componentImport.name} } from '${componentImport.module}'`]
  })
  const sections = spec.sections
    .map((section) => `      ${EXPORT_TEMPLATES[section.component](section.props, section.children)}`)
    .join('\n')

  return `${imports.join('\n')}\n\nexport default function GeneratedPage() {\n  return (\n    <main data-theme=${JSON.stringify(spec.theme)}>\n${sections}\n    </main>\n  )\n}\n`
}

export async function exportPage(input: z.infer<typeof exportPageInputSchema>) {
  let spec: unknown
  let exportName = 'inline-export'

  if (input.name !== undefined) {
    const page = await readPage(input.name)
    if (!page.ok) return page
    spec = page.spec
    exportName = input.name
  } else {
    spec = input.spec
  }

  const validation = validatePageSpec(spec)
  if (!validation.ok) return validation

  const pathResult = resolveExportPath(exportName)
  if (!pathResult.ok) return pathResult

  const source = buildSource(validation.spec)
  try {
    await writeFile(pathResult.path, source, 'utf8')
    return { ok: true as const, path: pathResult.path, source }
  } catch (error) {
    return { ok: false as const, errors: [`export: ${errorMessage(error)}`] }
  }
}
