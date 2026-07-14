import { useEffect, useRef, useState } from 'react'
import type { ProjectStackProps } from '../schemas'

type Project = ProjectStackProps['items'][number]

function ProjectItem({ project, index }: { project: Project; index: number }) {
  const itemRef = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const item = itemRef.current
    if (!item) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setRevealed(true)
        observer.unobserve(item)
      },
      { threshold: 0.18 },
    )
    observer.observe(item)
    return () => observer.disconnect()
  }, [])

  return (
    <article
      ref={itemRef}
      className="transition-[opacity,transform] duration-700 motion-reduce:transition-none"
      style={{ opacity: revealed ? 1 : 0, transform: revealed ? 'translateY(0)' : 'translateY(2rem)' }}
    >
      <header className="mb-7 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(18rem,.7fr)] md:items-end">
        <h2 className="font-display text-heading tracking-tight md:pl-[8%]">
          <span className="mr-4 align-top text-caption text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
          {project.name}
        </h2>
        <p className="max-w-xl text-body-token text-muted-foreground">{project.description}</p>
      </header>
      <figure className="aspect-[16/9] overflow-hidden rounded-3xl bg-muted">
        <img src={project.image} alt={`${project.name}: ${project.description}`} className="h-full w-full object-cover" />
      </figure>
    </article>
  )
}

export function ProjectStack({ items }: ProjectStackProps) {
  return (
    <section aria-label="Selected projects" className="bg-background px-5 py-24 font-body text-foreground md:px-10 md:py-32">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-28 md:gap-40">
        {items.map((project, index) => (
          <ProjectItem key={`${project.name}-${index}`} project={project} index={index} />
        ))}
      </div>
    </section>
  )
}
