import { useEffect, useRef } from 'react'
import type { VideoLoopProps } from '../schemas'
import { THEME_TOKENS } from '../tokens'

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
    <section className="relative min-h-screen overflow-hidden" style={{ backgroundColor: THEME_TOKENS.colors.black }}>
      <video ref={videoRef} src={src} muted playsInline preload="auto" className="absolute inset-0 h-full w-full scale-110 object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      {caption ? <p className="absolute bottom-10 left-8 right-8 text-sm uppercase tracking-[.2em] text-white md:left-14">{caption}</p> : null}
    </section>
  )
}
