import { useEffect, useState } from 'react'
import type { DepthCarouselProps } from '../schemas'

const classesByRole = {
  center: 'bottom-0 left-1/2 z-20 h-[72%] -translate-x-1/2 scale-[1.15] opacity-100 blur-none',
  left: 'bottom-[7%] left-[18%] z-10 h-[42%] -translate-x-1/2 opacity-[0.82] blur-[1px]',
  right: 'bottom-[7%] left-[82%] z-10 h-[42%] -translate-x-1/2 opacity-[0.82] blur-[1px]',
  back: 'bottom-[9%] left-1/2 z-[5] h-[30%] -translate-x-1/2 opacity-90 blur-[2px]',
}

export function DepthCarousel({ title, images, autoAdvanceMs }: DepthCarouselProps) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    images.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
  }, [images])

  useEffect(() => {
    if (autoAdvanceMs === undefined) return
    const interval = window.setInterval(() => setActive((current) => (current + 1) % images.length), autoAdvanceMs)
    return () => window.clearInterval(interval)
  }, [autoAdvanceMs, images.length])

  const roles = {
    center: active,
    left: (active + 3) % 4,
    right: (active + 1) % 4,
    back: (active + 2) % 4,
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden font-body text-inverted-foreground transition-[background-color] duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
      style={{ backgroundColor: images[active].bg }}
    >
      <h2 className="absolute inset-x-0 top-[12%] z-[1] px-6 text-center font-display text-heading font-black uppercase opacity-80">
        {title}
      </h2>
      {images.map((image, index) => {
        const role = index === roles.center ? 'center' : index === roles.left ? 'left' : index === roles.right ? 'right' : 'back'
        return (
          <div
            key={image.src}
            className={`absolute aspect-square transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${classesByRole[role]}`}
          >
            <img src={image.src} alt="" draggable={false} className="h-full w-full object-contain object-bottom" />
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => setActive((current) => (current + 1) % images.length)}
        className="absolute bottom-8 right-8 z-30 rounded-full bg-primary px-5 py-3 text-caption uppercase tracking-widest text-primary-foreground backdrop-blur"
        aria-label="Show next carousel image"
      >
        Next
      </button>
    </section>
  )
}
