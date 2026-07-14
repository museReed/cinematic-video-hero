import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import type { SplitVideoScrubProps } from '../schemas'

type VideoSide = 'left' | 'right'

export function SplitVideoScrub({
  left,
  right,
  mode = 'independent',
  deadZone = { left: 0.42, right: 0.58 },
}: SplitVideoScrubProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)
  const boundsRef = useRef<DOMRect | null>(null)
  const targetsRef = useRef<Record<VideoSide, number>>({ left: 0, right: 0 })
  const seekingRef = useRef<Record<VideoSide, boolean>>({ left: false, right: false })
  const [activeSide, setActiveSide] = useState<VideoSide>('left')
  const [neutral, setNeutral] = useState(false)
  const [scrubEnabled, setScrubEnabled] = useState(false)

  const videoFor = (side: VideoSide) => (side === 'left' ? leftRef.current : rightRef.current)

  const flushSeek = (side: VideoSide) => {
    const video = videoFor(side)
    if (!video || seekingRef.current[side] || !Number.isFinite(video.duration) || video.duration <= 0) return
    const target = Math.min(video.duration, Math.max(0, targetsRef.current[side]))
    if (Math.abs(video.currentTime - target) < 0.01) return
    seekingRef.current[side] = true
    video.currentTime = target
  }

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setScrubEnabled(!coarsePointer.matches && !reducedMotion.matches)
    update()
    coarsePointer.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)
    return () => {
      coarsePointer.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const updateBounds = () => {
      boundsRef.current = section.getBoundingClientRect()
    }
    updateBounds()
    const observer = new ResizeObserver(updateBounds)
    observer.observe(section)
    window.addEventListener('resize', updateBounds)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateBounds)
    }
  }, [])

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!scrubEnabled) return
    const rect = boundsRef.current ?? event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    let side: VideoSide
    let localRatio: number

    if (mode === 'dead-zone') {
      if (ratio >= deadZone.left && ratio <= deadZone.right) {
        setNeutral(true)
        return
      }
      setNeutral(false)
      side = ratio < deadZone.left ? 'left' : 'right'
      localRatio = side === 'left' ? ratio / deadZone.left : (ratio - deadZone.right) / (1 - deadZone.right)
    } else {
      side = ratio < 0.5 ? 'left' : 'right'
      localRatio = side === 'left' ? ratio * 2 : (ratio - 0.5) * 2
    }

    const video = videoFor(side)
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
    setActiveSide(side)
    targetsRef.current[side] = Math.min(video.duration, Math.max(0, localRatio * video.duration))
    flushSeek(side)
  }

  const renderVideo = (side: VideoSide, src: string, ref: typeof leftRef) => (
    <div className={`relative min-h-[50vh] overflow-hidden transition-opacity ${activeSide === side ? 'opacity-100' : 'opacity-50'}`}>
      <video
        ref={ref}
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-label={`${side} comparison video`}
        className="h-full w-full object-cover"
        onLoadedMetadata={(event) => {
          const video = event.currentTarget
          video.pause()
          targetsRef.current[side] = 0
          seekingRef.current[side] = false
          video.currentTime = 0
        }}
        onPlay={(event) => event.currentTarget.pause()}
        onSeeked={() => {
          seekingRef.current[side] = false
          flushSeek(side)
        }}
      />
      <span className="pointer-events-none absolute bottom-6 left-6 text-caption font-medium uppercase tracking-widest text-inverted-foreground">
        {side}
      </span>
    </div>
  )

  return (
    <section
      ref={sectionRef}
      aria-label="Split video comparison"
      className={`relative grid min-h-screen grid-cols-2 overflow-hidden bg-inverted font-body text-inverted-foreground ${scrubEnabled ? 'cursor-ew-resize' : ''}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setNeutral(false)}
    >
      {renderVideo('left', left, leftRef)}
      {renderVideo('right', right, rightRef)}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 border-l border-inverted-foreground/50" />
      {mode === 'dead-zone' ? (
        <div
          className={`pointer-events-none absolute inset-y-0 border-x border-inverted-foreground/20 bg-inverted/40 transition-opacity ${neutral ? 'opacity-100' : 'opacity-40'}`}
          style={{ left: `${deadZone.left * 100}%`, right: `${(1 - deadZone.right) * 100}%` }}
        >
          <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap text-caption uppercase tracking-widest">Neutral zone</span>
        </div>
      ) : null}
      {!scrubEnabled || mode === 'dead-zone' ? (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-card p-2 text-card-foreground shadow-lg">
          {(['left', 'right'] as const).map((side) => (
            <button
              key={side}
              type="button"
              aria-label={`Select ${side} video`}
              aria-pressed={activeSide === side}
              onClick={() => setActiveSide(side)}
              className={`rounded-full px-4 py-2 text-caption uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${activeSide === side ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {side}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
