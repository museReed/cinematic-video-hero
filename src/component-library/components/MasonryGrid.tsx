import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { MasonryGridProps } from '../schemas'

type MasonryItem = MasonryGridProps['items'][number]
type AssignedItem = { item: MasonryItem; sourceIndex: number; rowIndex: number }

function distribute(items: MasonryItem[], columnCount: number) {
  const assigned: AssignedItem[][] = Array.from({ length: columnCount }, () => [])
  const heights = Array.from({ length: columnCount }, () => 0)

  items.forEach((item, sourceIndex) => {
    const columnIndex = heights.indexOf(Math.min(...heights))
    assigned[columnIndex].push({ item, sourceIndex, rowIndex: assigned[columnIndex].length })
    heights[columnIndex] += 1 / item.aspect
  })

  return assigned
}

export function MasonryGrid({ items, columns }: MasonryGridProps) {
  const mobileColumns = columns?.mobile ?? 2
  const desktopColumns = columns?.desktop ?? 3
  const [columnCount, setColumnCount] = useState<1 | 2 | 3 | 4>(mobileColumns)
  const [assignmentReady, setAssignmentReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const assigned = useMemo(() => distribute(items, columnCount), [columnCount, items])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const update = () => {
      const nextCount = desktop.matches ? desktopColumns : mobileColumns
      setColumnCount((current) => (current === nextCount ? current : nextCount))
    }
    update()
    desktop.addEventListener('change', update)
    return () => desktop.removeEventListener('change', update)
  }, [desktopColumns, mobileColumns])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setAssignmentReady(false)
    const frame = requestAnimationFrame(() => setAssignmentReady(true))
    return () => cancelAnimationFrame(frame)
  }, [assigned])

  return (
    <section aria-label="Masonry gallery" className="min-h-screen bg-background px-4 py-16 font-body text-foreground md:px-8">
      <ol className="sr-only">
        {items.map((item, index) => (
          <li key={`${item.src}-${index}`}>Gallery image {index + 1}</li>
        ))}
      </ol>
      <div aria-hidden="true" className="mx-auto grid max-w-7xl gap-4" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {assigned.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map(({ item, sourceIndex, rowIndex }) => (
              <motion.figure
                key={`${item.src}-${sourceIndex}`}
                initial={false}
                animate={{ opacity: 1, y: assignmentReady || reducedMotion ? 0 : 24 }}
                transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : columnIndex * 0.08 + rowIndex * 0.1 }}
                className="overflow-hidden rounded-2xl bg-muted"
                style={{ aspectRatio: item.aspect }}
              >
                <img src={item.src} alt="" className="h-full w-full object-cover" />
              </motion.figure>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
