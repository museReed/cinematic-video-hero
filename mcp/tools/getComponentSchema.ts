import { zodToJsonSchema } from 'zod-to-json-schema'
import { componentRegistry, type ComponentId } from '../../src/component-library/registry'

function isComponentId(value: string): value is ComponentId {
  return Object.prototype.hasOwnProperty.call(componentRegistry, value)
}

export function getComponentSchema({ componentId }: { componentId: string }) {
  if (!isComponentId(componentId)) return { ok: false as const, error: `Unknown component ${componentId}` }

  const entry = componentRegistry[componentId]
  return {
    ok: true as const,
    componentId,
    schema: zodToJsonSchema(entry.propsSchema, { name: componentId, $refStrategy: 'none' }),
    allowedChildren: entry.allowedChildren,
    examples: entry.examples,
  }
}
