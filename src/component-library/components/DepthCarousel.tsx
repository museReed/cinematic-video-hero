import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type { DepthCarouselProps } from '../schemas'

const stylesByRole: Record<'center' | 'left' | 'right' | 'back', CSSProperties> = {
  center: { left: '50%', height: '72%', bottom: '0%', transform: 'translateX(-50%) scale(1.15)', filter: 'blur(0)', opacity: 1, zIndex: 20 },
  left: { left: '18%', height: '42%', bottom: '7%', transform: 'translateX(-50%)', filter: 'blur(1px)', opacity: 0.82, zIndex: 10 },
  right: { left: '82%', height: '42%', bottom: '7%', transform: 'translateX(-50%)', filter: 'blur(1px)', opacity: 0.82, zIndex: 10 },
  back: { left: '50%', height: '30%', bottom: '9%', transform: 'translateX(-50%)', filter: 'blur(2px)', opacity: 0.9, zIndex: 5 },
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
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: images[active].bg, fontFamily: 'var(--ck-font-body)', transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)' }}
    >
      <h2
        className="absolute inset-x-0 top-[12%] z-[1] px-6 text-center text-6xl font-black uppercase leading-none opacity-80 md:text-8xl"
        style={{ color: 'var(--ck-color-dark-ink)', fontFamily: 'var(--ck-font-display)' }}
      >
        {title}
      </h2>
      {images.map((image, index) => {
        const role = index === roles.center ? 'center' : index === roles.left ? 'left' : index === roles.right ? 'right' : 'back'
        return (
          <div
            key={image.src}
            className="absolute aspect-square"
            style={{
              ...stylesByRole[role],
              transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            <img src={image.src} alt="" draggable={false} className="h-full w-full object-contain object-bottom" />
          </div>
        )
      })}
      <button
        type="button"
        onClick={() => setActive((current) => (current + 1) % images.length)}
        className="absolute bottom-8 right-8 z-30 rounded-full border px-5 py-3 text-xs uppercase tracking-widest backdrop-blur"
        style={{ backgroundColor: 'var(--ck-color-dark-surface)', borderColor: 'var(--ck-color-dark-ink)', color: 'var(--ck-color-dark-ink)' }}
        aria-label="Show next carousel image"
      >
        Next
      </button>
    </section>
  )
}
