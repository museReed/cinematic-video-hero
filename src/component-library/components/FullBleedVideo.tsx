import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { FullBleedVideoProps } from '../schemas'

export function FullBleedVideo({
  src,
  caption,
  focalY = 0,
  interaction = 'none',
  fallback = 'radial-glow',
}: FullBleedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const frameRef = useRef<number | null>(null)
  const previousXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [scrubEnabled, setScrubEnabled] = useState(false)

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateScrubAvailability = () => setScrubEnabled(!coarsePointer.matches && !reducedMotion.matches)

    updateScrubAvailability()
    coarsePointer.addEventListener('change', updateScrubAvailability)
    reducedMotion.addEventListener('change', updateScrubAvailability)
    return () => {
      coarsePointer.removeEventListener('change', updateScrubAvailability)
      reducedMotion.removeEventListener('change', updateScrubAvailability)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (interaction !== 'none') {
      video.pause()
      video.style.opacity = '1'
      return
    }

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
      frameRef.current = null
      video.pause()
    }
  }, [interaction, src])

  const queueSeek = () => {
    const video = videoRef.current
    if (!video || seekingRef.current || !Number.isFinite(video.duration) || video.duration <= 0) return
    const target = Math.min(video.duration, Math.max(0, targetTimeRef.current))
    if (Math.abs(video.currentTime - target) < 0.01) return
    seekingRef.current = true
    video.currentTime = target
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const video = videoRef.current
    if (interaction !== 'scrub' || !scrubEnabled || !video || !Number.isFinite(video.duration) || video.duration <= 0) return
    if (previousXRef.current === null) {
      previousXRef.current = event.clientX
      return
    }

    const width = event.currentTarget.getBoundingClientRect().width
    const delta = event.clientX - previousXRef.current
    previousXRef.current = event.clientX
    targetTimeRef.current = Math.min(video.duration, Math.max(0, targetTimeRef.current + (delta / width) * 0.8 * video.duration))
    queueSeek()
  }

  return (
    <section
      className={`relative min-h-screen overflow-hidden bg-inverted font-body text-inverted-foreground ${interaction === 'scrub' && scrubEnabled ? 'cursor-ew-resize' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        previousXRef.current = null
      }}
    >
      {videoFailed ? (
        <div className="absolute inset-0 bg-inverted">
          {fallback === 'radial-glow' ? (
            <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-40 blur-3xl" />
          ) : null}
        </div>
      ) : null}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `translateY(${focalY}%) scale(1.1)` }}
        onError={() => setVideoFailed(true)}
        onLoadedMetadata={(event) => {
          const video = event.currentTarget
          setVideoFailed(false)
          if (interaction !== 'scrub' || !Number.isFinite(video.duration) || video.duration <= 0) return
          targetTimeRef.current = video.duration / 2
          seekingRef.current = false
          video.currentTime = targetTimeRef.current
        }}
        onSeeked={() => {
          seekingRef.current = false
          queueSeek()
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inverted via-transparent to-inverted opacity-70" />
      {caption ? <p className="absolute bottom-10 left-8 right-8 text-caption uppercase tracking-[.2em] md:left-14">{caption}</p> : null}
    </section>
  )
}
