import { useEffect, useRef } from 'react'
import type { VideoLoopProps } from '../schemas'

export function VideoLoop({ src, caption }: VideoLoopProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const cycleMs = 4200
    const start = performance.now()
    let previousCycle = -1

    const run = (now: number) => {
      const elapsed = now - start
      const cycle = Math.floor(elapsed / cycleMs)
      const phase = elapsed % cycleMs

      if (cycle !== previousCycle) {
        previousCycle = cycle
        video.currentTime = 0
        void video.play().catch(() => undefined)
      }

      video.style.opacity = String(phase < 650 ? phase / 650 : phase < 3500 ? 1 : Math.max(0, 1 - (phase - 3500) / 700))
      frameRef.current = requestAnimationFrame(run)
    }

    frameRef.current = requestAnimationFrame(run)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [src])

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--ck-color-dark-surface)', color: 'var(--ck-color-dark-ink)', fontFamily: 'var(--ck-font-body)' }}
    >
      <video ref={videoRef} src={src} muted playsInline preload="auto" className="absolute inset-0 h-full w-full scale-110 object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--ck-color-dark-surface) 70%, transparent), transparent, color-mix(in srgb, var(--ck-color-dark-surface) 20%, transparent))' }}
      />
      {caption ? <p className="absolute bottom-10 left-8 right-8 text-sm uppercase tracking-[.2em] md:left-14">{caption}</p> : null}
    </section>
  )
}
