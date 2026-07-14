import { componentRegistry } from '../../src/component-library/registry'

export function searchComponents({ query, group }: { query?: string; group?: string }) {
  const normalizedQuery = query?.trim().toLowerCase()
  const normalizedGroup = group?.trim().toLowerCase()

  return Object.entries(componentRegistry)
    .filter(([id, entry]) => {
      const componentGroup = id.split('.')[0]
      const matchesGroup = !normalizedGroup || componentGroup === normalizedGroup
      const matchesQuery = !normalizedQuery || `${id} ${entry.description}`.toLowerCase().includes(normalizedQuery)
      return matchesGroup && matchesQuery
    })
    .map(([id, entry]) => ({
      id,
      group: id.split('.')[0],
      description: entry.description,
      topLevel: entry.topLevel,
      allowedChildren: entry.allowedChildren,
    }))
}
