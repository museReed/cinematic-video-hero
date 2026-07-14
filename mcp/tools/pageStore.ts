import { access, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod/v3'
import { validatePageSpec } from '../../src/page-builder/validatePageSpec'

const GENERATED_DIR = path.resolve(process.cwd(), 'generated-pages')

export const pageNameSchema = z
  .string()
  .max(40)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Page name must be a kebab-case slug')

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function resolvePagePath(name: string) {
  const nameResult = pageNameSchema.safeParse(name)
  if (!nameResult.success) {
    return { ok: false as const, errors: nameResult.error.issues.map((issue) => `name: ${issue.message}`) }
  }

  const pagePath = path.resolve(GENERATED_DIR, `${nameResult.data}.json`)
  if (path.dirname(pagePath) !== GENERATED_DIR) {
    return { ok: false as const, errors: ['name: Page path must stay inside generated-pages'] }
  }

  return { ok: true as const, path: pagePath }
}

export async function pageExists(pagePath: string) {
  try {
    await access(pagePath)
    return true
  } catch {
    return false
  }
}

export async function readPage(name: string) {
  const pathResult = resolvePagePath(name)
  if (!pathResult.ok) return pathResult

  try {
    const contents = await readFile(pathResult.path, 'utf8')
    return { ok: true as const, path: pathResult.path, spec: JSON.parse(contents) as unknown }
  } catch (error) {
    return { ok: false as const, errors: [`page: ${errorMessage(error)}`] }
  }
}

export async function writePage(name: string, spec: unknown, overwrite: boolean) {
  const pathResult = resolvePagePath(name)
  if (!pathResult.ok) return pathResult

  const validation = validatePageSpec(spec)
  if (!validation.ok) return validation

  try {
    await writeFile(pathResult.path, `${JSON.stringify(validation.spec, null, 2)}\n`, {
      encoding: 'utf8',
      flag: overwrite ? 'w' : 'wx',
    })
    return { ok: true as const, path: pathResult.path, spec: validation.spec }
  } catch (error) {
    return { ok: false as const, errors: [`page: ${errorMessage(error)}`] }
  }
}
