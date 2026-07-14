import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Film,
  Glasses,
  ImageIcon,
  Layers3,
  MousePointer2,
  Palette,
  Play,
  Quote,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  WandSparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4'

const MAINFRAME_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

const ARCHIVE_VIDEOS = {
  left: 'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154433_532a85d3-dabf-4265-b8bd-19ac6af31842.mp4',
  right: 'https://d8j0ntlcm91z4.cloudfront.net/user_39ca84eAE1ODL9hbR5VhoEj8tBf/hf_20260625_154401_a664f076-b971-4557-8728-40ef9ea4c49b.mp4',
}

const TOON_IMAGES = [
  { src: '/characters/fluent-astronaut.png', bg: '#746BE8' },
  { src: '/characters/fluent-ninja.png', bg: '#39304F' },
  { src: '/characters/fluent-mage.png', bg: '#31A7E8' },
  { src: '/characters/fluent-superhero.png', bg: '#ED6CA8' },
]

const STUDIO_GIFS = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-portfolio-cosmic-preview-BpvWJ3Nc.gif',
  'https://motionsites.ai/assets/hero-velorah-preview-CJNTtbpd.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
]

type PresetId = 'cinematic' | 'creator' | 'archive' | 'image-product' | 'studio'
type PreviewKind =
  | 'video-fade'
  | 'focus-shift'
  | 'liquid-glass'
  | 'masked-border'
  | 'hero-reveal'
  | 'fallback'
  | 'fade-in'
  | 'magnet'
  | 'marquee'
  | 'animated-text'
  | 'sticky-stack'
  | 'gradient-type'
  | 'depth-carousel'
  | 'mouse-scrub-gaze'
  | 'dual-video-scrub'
  | 'dead-zone'
  | 'scroll-phases'
  | 'procedural-grid'
  | 'viewport-scale'
  | 'exclusion-ui'
  | 'custom-cursor'
  | 'scroll-outro'
  | 'core-features-section'
  | 'prompt-suggestion-card'
  | 'api-access-card'
  | 'project-library-card'
  | 'studio-hero'
  | 'studio-buttons'
  | 'studio-pricing'
  | 'studio-marquee'
  | 'studio-stagger'
  | 'studio-parallax'
  | 'studio-projects'
  | 'studio-carousel'
  | 'studio-mouse-trail'
  | 'studio-footer-nav'

type Feature = {
  id: string
  preset: PresetId
  group: string
  number: string
  title: string
  category: string
  summary: string
  kind: PreviewKind
  prompt: string
  script: string
  validations: string[]
  resources?: { label: string; url: string; note: string }[]
  production?: string[]
}

const features: Feature[] = [
  {
    id: 'video-fade-loop', preset: 'cinematic', group: 'Media & Composition', number: '01', title: 'RAF Video Loop', category: 'Motion', kind: 'video-fade',
    summary: 'Fade the background video without competing animations or a visible loop seam.',
    prompt: `Create a muted autoplaying background video. Do not use the native loop attribute. Fade in over 500ms with requestAnimationFrame. When 0.55 seconds remain, fade out over 500ms. Use a ref to prevent repeated fade-out triggers. Cancel any active frame before starting a new fade, and continue from the current opacity. On ended, wait 100ms, reset currentTime, play, then fade in.`,
    script: `const frameRef = useRef<number | null>(null)
const fadingOutRef = useRef(false)

function fadeTo(video: HTMLVideoElement, target: number) {
  if (frameRef.current) cancelAnimationFrame(frameRef.current)
  const from = Number(video.style.opacity || 0)
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min((now - start) / 500, 1)
    video.style.opacity = String(from + (target - from) * p)
    if (p < 1) frameRef.current = requestAnimationFrame(tick)
  }
  frameRef.current = requestAnimationFrame(tick)
}`,
    validations: ['No native loop attribute', 'RAF cancelled on replacement/unmount', 'Muted and playsInline enabled'],
  },
  {
    id: 'focal-shift', preset: 'cinematic', group: 'Media & Composition', number: '02', title: 'Focal Position', category: 'Composition', kind: 'focus-shift',
    summary: 'Reframe an existing asset so the meaningful content lands behind the UI.',
    prompt: `Render the background media absolute and full-bleed with object-cover. Shift it down by 17% using transform: translateY(17%). Keep the parent overflow-hidden. Treat the focal shift as a configurable number from -30% to 40%.`,
    script: `<div className="absolute inset-0 overflow-hidden">
  <video
    className="absolute inset-0 h-full w-full object-cover"
    style={{ transform: \`translateY(\${focalY}%)\` }}
  />
</div>`,
    validations: ['Parent clips overflow', 'Focal value is configurable', 'Mobile crop checked independently'],
  },
  {
    id: 'liquid-glass', preset: 'cinematic', group: 'Glass Surfaces', number: '03', title: 'Liquid Glass', category: 'Surface', kind: 'liquid-glass',
    summary: 'A translucent surface that borrows depth and color from moving content behind it.',
    prompt: `Create a reusable .liquid-glass surface with rgba(255,255,255,0.01), background-blend-mode luminosity, backdrop-filter blur(4px), no border, overflow hidden, and an inset 0 1px 1px rgba(255,255,255,0.1) highlight.`,
    script: `.liquid-glass {
  position: relative;
  overflow: hidden;
  border: 0;
  background: rgba(255,255,255,.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 1px rgba(255,255,255,.1);
}`,
    validations: ['Readable over bright and dark frames', 'WebKit backdrop prefix included', 'Focus style remains visible'],
  },
  {
    id: 'masked-border', preset: 'cinematic', group: 'Glass Surfaces', number: '04', title: 'Masked Glass Border', category: 'Surface', kind: 'masked-border',
    summary: 'Render a highlight around the edge without filling or dimming the glass interior.',
    prompt: `Add a ::before pseudo-element with inset 0, inherited radius, and 1.4px padding. Apply a vertical white-to-transparent gradient. Use two WebKit masks with xor and mask-composite exclude so only the border remains. Set pointer-events none.`,
    script: `.liquid-glass::before {
  content: '';
  position: absolute; inset: 0; padding: 1.4px;
  border-radius: inherit;
  background: linear-gradient(180deg,#ffffff73,transparent 40% 60%,#ffffff73);
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
                   linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}`,
    validations: ['Pseudo-element ignores pointer events', 'Radius is inherited', 'Fallback border exists if mask unsupported'],
  },
  {
    id: 'hero-reveal', preset: 'cinematic', group: 'Entrance & Resilience', number: '05', title: 'Hero Reveal', category: 'Entrance', kind: 'hero-reveal',
    summary: 'Stage the brand, headline, form, and footer in a short cinematic introduction.',
    prompt: `Reveal hero elements in sequence: navigation at 0ms from y -20, heading at 150ms from y 40, supporting copy at 350ms from y 20, CTA at 500ms, and media at 600ms. Use opacity and transform only with a smooth ease-out curve.`,
    script: `const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { delay, duration: .7, ease: [0.25,.1,.25,1] }
  })
}
<motion.h1 custom={.15} variants={reveal}
  initial="hidden" animate="visible" />`,
    validations: ['Only opacity and transform animate', 'Reduced-motion path available', 'Content stays usable before animation'],
  },
  {
    id: 'media-fallback', preset: 'cinematic', group: 'Entrance & Resilience', number: '06', title: 'Media Fallback', category: 'Resilience', kind: 'fallback',
    summary: 'Preserve contrast and atmosphere when video fails or motion is disabled.',
    prompt: `Provide a pure-black fallback with a subtle radial glow and noise layer. Detect prefers-reduced-motion and pause decorative video. Keep all text and controls readable when the media URL fails.`,
    script: `const reduceMotion = useReducedMotion()

<div className="bg-black">
  {!reduceMotion && <video onError={() => setFailed(true)} />}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#27303b55,transparent_55%)]" />
</div>`,
    validations: ['No blank background on media error', 'prefers-reduced-motion respected', 'Minimum text contrast preserved'],
  },
  {
    id: 'mouse-scrub-gaze', preset: 'cinematic', group: 'Pointer Interaction', number: '07', title: 'Mouse-Scrub Gaze', category: 'Interaction', kind: 'mouse-scrub-gaze',
    summary: 'Map horizontal pointer movement to a pre-rendered character timeline so the subject appears to follow the cursor.',
    prompt: `Create a fixed full-screen muted video that does not autoplay. The source video must show one continuous, evenly paced head turn from looking left, through center, to looking right. Listen for horizontal pointer movement, track the previous X position, and convert delta X into a time offset: (delta / viewportWidth) * 0.8 * video.duration. Accumulate and clamp the target time between zero and duration. Allow only one seek at a time; while seeking, keep only the newest target and continue from onSeeked. Reset previous X when the pointer leaves. Provide touch-drag and reduced-motion fallbacks. The source performance must use a locked camera, closed mouth, stable lighting, no body translation, no blinking, and no background motion so reverse scrubbing remains believable.`,
    script: `const SENSITIVITY = 0.8
const prevX = useRef<number | null>(null)
const target = useRef(0)
const seeking = useRef(false)

function queueSeek(video: HTMLVideoElement) {
  if (seeking.current || !Number.isFinite(video.duration)) return
  if (Math.abs(video.currentTime - target.current) < 0.01) return
  seeking.current = true
  video.currentTime = target.current
}

function onPointerMove(e: React.PointerEvent, video: HTMLVideoElement) {
  if (prevX.current === null) { prevX.current = e.clientX; return }
  const delta = e.clientX - prevX.current
  prevX.current = e.clientX
  const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
  target.current = Math.min(video.duration, Math.max(0, target.current + offset))
  queueSeek(video)
}

function onSeeked(video: HTMLVideoElement) {
  seeking.current = false
  queueSeek(video)
}`,
    validations: ['Video does not autoplay', 'Only one seek can be in flight', 'Target time is clamped to duration', 'Pointer listeners and refs reset cleanly', 'Mobile and reduced-motion fallbacks exist'],
    production: [
      'Record or generate a 4–6 second performance: look left → center → right at constant speed.',
      'Keep the mouth closed, camera locked, lighting stable, and remove blinking or wind motion.',
      'Re-encode with dense keyframes, such as H.264 with GOP/keyframe interval 6, for responsive reverse seeking.',
    ],
    resources: [
      { label: 'Runway Act-Two', url: 'https://runwayml.com/apps/add-performance', note: 'Best control: transfer a recorded head turn to a reference character.' },
      { label: 'Higgsfield Image-to-Video', url: 'https://higgsfield.ai/image-to-video-ai', note: 'Fastest route from one portrait to a directed motion clip.' },
      { label: 'Higgsfield Wan Animate', url: 'https://higgsfield.ai/wan-animate-ai-video', note: 'Uses a motion-template video to drive the character.' },
      { label: 'Google Veo / Flow', url: 'https://deepmind.google/models/veo/', note: 'High-quality image-to-video and character motion controls.' },
      { label: 'MetaHuman Animator', url: 'https://dev.epicgames.com/documentation/metahuman/metahuman-animator-in-unreal-engine', note: 'Deterministic 3D route for production facial control.' },
    ],
  },
  {
    id: 'fade-in', preset: 'creator', group: 'Entrance & Typography', number: '01', title: 'Viewport FadeIn', category: 'Entrance', kind: 'fade-in',
    summary: 'A reusable in-view entrance contract for every major portfolio block.',
    prompt: `Build a FadeIn motion wrapper accepting delay, duration, x and y. Use whileInView, initial opacity 0, viewport once true, margin 50px and amount 0. Use cubic-bezier [0.25,0.1,0.25,1]. Default duration 0.7 and y 30.`,
    script: `function FadeIn({ children, delay=0, x=0, y=30 }) {
  return <motion.div
    initial={{ opacity: 0, x, y }}
    whileInView={{ opacity: 1, x: 0, y: 0 }}
    viewport={{ once: true, margin: '50px', amount: 0 }}
    transition={{ delay, duration: .7, ease: [.25,.1,.25,1] }}>
    {children}
  </motion.div>
}`,
    validations: ['Runs only once by default', 'No layout properties animated', 'Reduced-motion override included'],
  },
  {
    id: 'magnet', preset: 'creator', group: 'Interaction & Depth', number: '02', title: 'Magnetic Portrait', category: 'Interaction', kind: 'magnet',
    summary: 'Let the portrait subtly follow the pointer, then settle back without snapping.',
    prompt: `Create a Magnet component. Measure pointer distance from the element center and activate within 150px of its edge. Translate with translate3d, dividing the delta by strength 3. Transition in with transform .3s ease-out and return with .6s ease-in-out. Use will-change transform.`,
    script: `function onMove(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = (e.clientX - (rect.left + rect.width / 2)) / 3
  const y = (e.clientY - (rect.top + rect.height / 2)) / 3
  e.currentTarget.style.transform = \`translate3d(\${x}px,\${y}px,0)\`
}

function onLeave(e) {
  e.currentTarget.style.transition = 'transform .6s ease-in-out'
  e.currentTarget.style.transform = 'translate3d(0,0,0)'
}`,
    validations: ['Pointer distance bounded', 'Transform resets on leave', 'Disabled for coarse pointers'],
  },
  {
    id: 'scroll-marquee', preset: 'creator', group: 'Scroll Systems', number: '03', title: 'Scroll Marquee', category: 'Scroll', kind: 'marquee',
    summary: 'Move two visual rails in opposite directions using scroll progress.',
    prompt: `Create two horizontal image rows. Duplicate each source list only as needed to cover the viewport. Row one moves right and row two moves left from normalized scroll progress. Use transform only, passive observation or MotionValues, and will-change transform.`,
    script: `const { scrollYProgress } = useScroll({ target: sectionRef })
const rowOneX = useTransform(scrollYProgress, [0, 1], ['-20%', '5%'])
const rowTwoX = useTransform(scrollYProgress, [0, 1], ['0%', '-25%'])

<motion.div style={{ x: rowOneX, willChange: 'transform' }} />
<motion.div style={{ x: rowTwoX, willChange: 'transform' }} />`,
    validations: ['No React state update per scroll event', 'GIF count stays within budget', 'Rows cover wide screens without gaps'],
  },
  {
    id: 'animated-text', preset: 'creator', group: 'Scroll Systems', number: '04', title: 'Character Reveal', category: 'Scroll', kind: 'animated-text',
    summary: 'Map reading progress to individual character opacity without shifting the paragraph.',
    prompt: `Animate paragraph characters from opacity .2 to 1 according to scroll progress using offset start 0.8 and end 0.2. Preserve layout with an invisible text copy and absolutely layered animated spans. Provide one accessible text node and hide decorative spans from screen readers.`,
    script: `const { scrollYProgress } = useScroll({
  target: ref,
  offset: ['start 0.8', 'end 0.2']
})

const opacity = useTransform(
  scrollYProgress,
  [index / total, (index + 1) / total],
  [.2, 1]
)`,
    validations: ['Screen readers receive text once', 'Whitespace is preserved', 'Character limit prevents DOM overload'],
  },
  {
    id: 'sticky-stack', preset: 'creator', group: 'Scroll Systems', number: '05', title: 'Sticky Card Stack', category: 'Scroll', kind: 'sticky-stack',
    summary: 'Pin project cards and compress earlier work as the next card arrives.',
    prompt: `Place each project card in an 85vh scroll container and make it sticky at top 6rem on mobile and 8rem on desktop. Offset each card by index * 28px. Map card scroll progress to a target scale reduced by .03 per remaining card.`,
    script: `const { scrollYProgress } = useScroll({
  target: cardRef,
  offset: ['start end', 'start start']
})
const target = 1 - (total - 1 - index) * .03
const scale = useTransform(scrollYProgress, [0, 1], [1, target])

<motion.article style={{ scale, top: index * 28 }}
  className="sticky top-24" />`,
    validations: ['Card content fits mobile viewport', 'Sticky disabled where unsupported', 'Z-index follows visual order'],
  },
  {
    id: 'gradient-type', preset: 'creator', group: 'Entrance & Typography', number: '06', title: 'Gradient Display Type', category: 'Typography', kind: 'gradient-type',
    summary: 'Turn oversized typography into the portfolio’s visual material rather than plain text.',
    prompt: `Create .hero-heading with a 180-degree gradient from #646973 to #BBCCD7, clipped to the text with transparent fill. Use Kanit 900, uppercase, leading-none, tight tracking, whitespace nowrap, and clamp or viewport units for fluid scale.`,
    script: `.hero-heading {
  background: linear-gradient(180deg,#646973 0%,#BBCCD7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font: 900 clamp(3rem, 12vw, 10rem)/.85 'Kanit', sans-serif;
  letter-spacing: -.04em;
}`,
    validations: ['Fallback color supplied', 'No horizontal overflow on 320px', 'Heading remains a semantic h1/h2'],
  },
  {
    id: 'depth-role-carousel', preset: 'creator', group: 'Interaction & Depth', number: '07', title: 'Depth Role Carousel', category: '3D Illusion', kind: 'depth-carousel',
    summary: 'Rotate four flat character renders through center, left, right, and back depth roles.',
    prompt: `Build a four-item character carousel using a role-based 2D depth illusion. Keep every image mounted and derive center, left, right, and back roles from activeIndex with circular modulo arithmetic. Center is largest, sharp, and z-index 20; sides are smaller with 2px blur and z-index 10; back is smallest with 4px blur and z-index 5. Animate transform, filter, opacity, left, height, and bottom together over 650ms using cubic-bezier(0.4,0,0.2,1). Lock navigation for the same 650ms, preload every image, and clear the timeout on unmount. Provide smaller mobile role dimensions below 640px.`,
    script: `const center = activeIndex
const left = (activeIndex + total - 1) % total
const right = (activeIndex + 1) % total
const back = (activeIndex + 2) % total

function navigate(direction: 'next' | 'prev') {
  if (isAnimating) return
  setIsAnimating(true)
  setActiveIndex(i => direction === 'next'
    ? (i + 1) % total
    : (i + total - 1) % total)
  timeoutRef.current = window.setTimeout(
    () => setIsAnimating(false), 650
  )
}

// Transition transform, filter, opacity, left, height and bottom.
// Preload sources with: images.forEach(({src}) => new Image().src = src)`,
    validations: ['All four images stay mounted', 'Navigation locks for exactly one transition', 'Height and bottom animate without snapping', 'Timeout is cleared on unmount'],
  },
  {
    id: 'dual-video-scrub', preset: 'archive', group: 'Media & Interaction', number: '01', title: 'Dual Video Scrub', category: 'Media', kind: 'dual-video-scrub',
    summary: 'Scrub two paused fashion films independently without flooding either decoder with seeks.',
    prompt: `Build a split-screen archive viewer with one paused video per side. Map pointer position inside each half to that video duration. Keep a latest target time per video and allow only one seek in flight; on seeked, apply the queued target. Never autoplay. Recompute bounds on resize and provide poster or first-frame fallbacks for touch and reduced-motion users.`,
    script: `const targets = useRef({ left: 0, right: 0 })
const seeking = useRef({ left: false, right: false })

function queueSeek(side, ratio) {
  const video = videos[side].current
  if (!video || !Number.isFinite(video.duration)) return
  targets.current[side] = clamp(ratio * video.duration, 0, video.duration)
  if (seeking.current[side]) return
  seeking.current[side] = true
  video.currentTime = targets.current[side]
}

function onSeeked(side) {
  seeking.current[side] = false
  queueSeek(side, targets.current[side] / videos[side].current.duration)
}`,
    validations: ['Videos remain paused', 'Only one seek per video is in flight', 'Targets clamp to duration', 'Resize, touch and reduced-motion fallbacks exist'],
  },
  {
    id: 'dead-zone-switcher', preset: 'archive', group: 'Media & Interaction', number: '02', title: 'Dead Zone Switcher', category: 'Interaction', kind: 'dead-zone',
    summary: 'Switch the active film only after the pointer clears a stable central neutral zone.',
    prompt: `Divide the viewer into left, dead-zone and right regions. Entering the outer regions updates activeSide. Inside the center band, preserve the last active side and return that film to its configured start frame. Make both thresholds configurable, show a visible neutral cue, and avoid rapid switching near the midpoint.`,
    script: `const leftEdge = .42
const rightEdge = .58

function resolveSide(xRatio) {
  if (xRatio < leftEdge) setActiveSide('left')
  if (xRatio > rightEdge) setActiveSide('right')
  // Between thresholds: retain the last active side.
  // Seek that side to its configured start frame.
}`,
    validations: ['Thresholds are configurable', 'Center keeps the last active side', 'No midpoint flicker', 'Keyboard and touch users receive explicit controls'],
  },
  {
    id: 'scroll-phase-director', preset: 'archive', group: 'Scroll Direction', number: '03', title: 'Scroll Phase Director', category: 'Scroll', kind: 'scroll-phases',
    summary: 'Convert one normalized scroll value into named, non-overlapping editorial phases.',
    prompt: `Create one scroll progress owner and derive intro, archive and exit phases from it. Use explicit ranges with small handoff overlaps, then pass derived progress to child sections. Do not attach independent scroll listeners in each section. Keep transforms under one owner and expose a reduced-motion state with all content readable.`,
    script: `const { scrollYProgress } = useScroll({ target: storyRef })
const intro = useTransform(scrollYProgress, [0, .32], [0, 1])
const archive = useTransform(scrollYProgress, [.28, .72], [0, 1])
const exit = useTransform(scrollYProgress, [.68, 1], [0, 1])

// A single director owns section transforms.
// Children consume phase progress; they do not add scroll listeners.`,
    validations: ['Exactly one scroll progress source', 'Phase ranges are documented', 'One transform owner per element', 'Reduced-motion content remains complete'],
  },
  {
    id: 'procedural-archive-grid', preset: 'archive', group: 'Layout & Layering', number: '04', title: 'Procedural Waterfall Grid', category: 'Masonry', kind: 'procedural-grid',
    summary: 'Flow variable-height archive looks into balanced columns with a deliberate waterfall rhythm.',
    prompt: `Build a responsive masonry archive with two columns on mobile and three on desktop. Give every tile a deterministic aspect ratio, then place each new tile into the currently shortest column. Animate tiles upward with a column-aware stagger only after column assignment is stable. Recalculate once when the responsive column count changes; never measure or rewrite layout on every scroll frame. Preserve a separate linear reading order for assistive technology.`,
    script: `function distribute(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => [])
  const heights = Array(columnCount).fill(0)

  items.forEach((item) => {
    const target = heights.indexOf(Math.min(...heights))
    columns[target].push(item)
    heights[target] += item.estimatedHeight + GAP
  })
  return columns
}

columns.map((column, columnIndex) =>
  column.map((tile, rowIndex) => <motion.article
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: columnIndex * .06 + rowIndex * .09 }}
  />)
)`,
    validations: ['Every tile goes to the current shortest column', 'Two- and three-column layouts are deterministic', 'No per-frame layout measurement', 'Accessible reading order remains linear'],
  },
  {
    id: 'viewport-scale-cards', preset: 'archive', group: 'Scroll Direction', number: '05', title: 'Viewport Scale Cards', category: 'Composition', kind: 'viewport-scale',
    summary: 'Scale archive cards by viewport proximity without allowing multiple transform writers.',
    prompt: `For each archive card, map its center distance from the viewport center to scale 0.88–1 and opacity 0.55–1. Derive both values from the same MotionValue. The scale effect must be the sole transform owner; compose hover emphasis through a child element instead of a second transform on the card. Recompute measurements after resize.`,
    script: `const distance = useTransform(scrollYProgress, [0, .5, 1], [1, 0, 1])
const scale = useTransform(distance, [0, 1], [1, .88])
const opacity = useTransform(distance, [0, 1], [1, .55])

<motion.article style={{ scale, opacity }}>
  <div className="hover-surface">{children}</div>
</motion.article>`,
    validations: ['Scale has one transform owner', 'Hover motion is isolated on a child', 'Resize measurements refresh', 'Text remains readable at minimum scale'],
  },
  {
    id: 'exclusion-ui', preset: 'archive', group: 'Layout & Layering', number: '06', title: 'Exclusion UI', category: 'Layering', kind: 'exclusion-ui',
    summary: 'Keep navigation and credits legible while a cinematic panel moves underneath them.',
    prompt: `Build fixed header and footer exclusion zones above the animated archive panel. Define named z-index tokens: content 10, moving panel 30, chrome 50. The footer must never be covered by the panel. Use pointer-events none only on decorative layers and verify focus rings remain visible over both light and dark footage.`,
    script: `const layers = { content: 10, panel: 30, chrome: 50 }

<motion.div style={{ zIndex: layers.panel }} className="archive-panel" />
<header style={{ zIndex: layers.chrome }} className="fixed top-0" />
<footer style={{ zIndex: layers.chrome }} className="fixed bottom-0" />`,
    validations: ['Footer stays above the moving panel', 'Layer tokens replace arbitrary z-index values', 'Interactive chrome accepts pointer input', 'Focus rings remain visible'],
  },
  {
    id: 'custom-cursor', preset: 'archive', group: 'Media & Interaction', number: '07', title: 'Custom Cursor', category: 'Pointer', kind: 'custom-cursor',
    summary: 'Add editorial pointer feedback without hiding native affordances from unsupported devices.',
    prompt: `Create a custom cursor for fine pointers only. Update x and y through MotionValues rather than React render state. Enlarge it over interactive archive tiles and label the current action. Restore the native cursor for coarse pointers, keyboard focus, reduced motion and whenever the pointer leaves the experience.`,
    script: `const x = useMotionValue(-100)
const y = useMotionValue(-100)

function onPointerMove(event) {
  x.set(event.clientX)
  y.set(event.clientY)
}

<motion.div aria-hidden style={{ x, y }} className="custom-cursor" />
// Enable only when matchMedia('(pointer: fine)') matches.`,
    validations: ['Disabled for coarse pointers', 'Native cursor returns outside the experience', 'Keyboard focus never depends on hover', 'MotionValues avoid render-per-move'],
  },
  {
    id: 'scroll-outro', preset: 'archive', group: 'Scroll Direction', number: '08', title: 'Scroll Outro', category: 'Exit', kind: 'scroll-outro',
    summary: 'Resolve the archive story into a clean footer handoff without covering final content.',
    prompt: `Use the director's final phase to scale the archive stage down, soften its opacity and reveal the footer underneath. The panel transform must still be owned by the scroll director. Keep the footer above the panel with the chrome z-index token, clamp progress, and switch directly to the final readable state for reduced motion.`,
    script: `const stageScale = useTransform(exitProgress, [0, 1], [1, .88])
const stageY = useTransform(exitProgress, [0, 1], ['0%', '-8%'])
const footerOpacity = useTransform(exitProgress, [.2, 1], [0, 1])

<motion.main style={{ scale: stageScale, y: stageY }} />
<motion.footer style={{ opacity: footerOpacity, zIndex: layers.chrome }} />`,
    validations: ['Exit progress clamps from 0 to 1', 'Footer is never occluded', 'Panel keeps one transform owner', 'Reduced motion shows the final state immediately'],
  },
  {
    id: 'core-features-section', preset: 'image-product', group: 'Section Layout', number: '01', title: 'Core Features Shell', category: 'Composition', kind: 'core-features-section',
    summary: 'Compose a responsive product header and three independent feature-card components.',
    prompt: `Build the outer Core Features section for an AI image product. Load Inter 400, 500 and 600, center a max-width 1100px container on white, then render a gradient badge, the title "Built for Speed & Quality" and a two-line subtitle. Compose PromptSuggestionCard, ApiAccessCard and ProjectLibraryCard inside a 24px-gap grid. Use three columns above 900px, two below 900px and one below 600px. Keep the shell responsible only for page spacing, typography and responsive composition.`,
    script: `function CoreFeaturesSection() {
  return <section className="c1-container">
    <p className="c1-badge">Core Features</p>
    <h2 className="c1-title">Built for Speed &amp; Quality</h2>
    <p className="c1-subtitle">Everything you need to go<br />from idea to image</p>
    <div className="c1-grid">
      <PromptSuggestionCard />
      <ApiAccessCard />
      <ProjectLibraryCard />
    </div>
  </section>
}

.c1-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
@media (max-width:900px) { .c1-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:600px) { .c1-grid { grid-template-columns:1fr; } }`,
    validations: ['Shell imports three independent card components', 'Three, two and one-column breakpoints work', 'Section heading hierarchy is semantic', 'All selectors remain c1-scoped'],
  },
  {
    id: 'prompt-suggestion-card', preset: 'image-product', group: 'Feature Cards', number: '02', title: 'Prompt Suggestion Card', category: 'AI Assistance', kind: 'prompt-suggestion-card',
    summary: 'Explain prompt enhancement with highlighted phrases, a detail pill and a cursor cue.',
    prompt: `Create a reusable PromptSuggestionCard. Use a warm radial gradient card with a white prompt box positioned near the top. Highlight the phrases "cheerful cartoon", "girl character" and "centred against a" using clipped orange-to-purple gradient text. Add a static "Add more details" pill and cursor SVG below the prompt. Keep the title pinned to the bottom. This is a marketing illustration, so the pill must not pretend to perform an action.`,
    script: `function PromptSuggestionCard() {
  return <article className="c1-card c1-card-1">
    <p className="c1-prompt">A bright 3D illustration of a
      <strong className="c1-blur-text"> cheerful cartoon girl</strong>
    </p>
    <div className="c1-detail-pill" aria-hidden>✦ Add more details</div>
    <CursorArrow aria-hidden />
    <h3>Smart Prompt Suggestions</h3>
  </article>
}`,
    validations: ['Decorative pill is not a fake button', 'Gradient phrases retain readable fallback color', 'Cursor SVG is hidden from assistive technology', 'Long prompt text stays inside the card'],
  },
  {
    id: 'api-access-card', preset: 'image-product', group: 'Feature Cards', number: '03', title: 'API Access Card', category: 'Integration', kind: 'api-access-card',
    summary: 'Present API connectivity through a focused network illustration and minimal label.',
    prompt: `Create a reusable ApiAccessCard with the shared 340px card base. Apply the purple-to-coral radial gradient, center the supplied network.svg inside an absolute visual region ending 70px above the bottom, and pin the "API Access" heading below it. Keep the image contained, preserve its aspect ratio and provide appropriate alternative text.`,
    script: `function ApiAccessCard() {
  return <article className="c1-card c1-card-2">
    <div className="c1-api-visual">
      <img className="c1-network-img" src={NETWORK_SVG} alt="API network" />
    </div>
    <h3>API Access</h3>
  </article>
}`,
    validations: ['Image uses object-fit contain', 'Visual never overlaps the heading', 'External asset failure leaves the title intact', 'Card follows the shared height and radius tokens'],
    resources: [{ label: 'Network illustration', url: 'https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg', note: 'API connectivity artwork used inside the card.' }],
  },
  {
    id: 'project-library-card', preset: 'image-product', group: 'Feature Cards', number: '04', title: 'Project Library Card', category: 'Asset Management', kind: 'project-library-card',
    summary: 'Represent a searchable asset library with a masked mesh, folder and static search cue.',
    prompt: `Create a reusable ProjectLibraryCard with the yellow-to-purple radial gradient. Add a 16px mesh made from two one-pixel linear gradients and fade it with a radial mask from the top center. Center the supplied folder artwork at 50px and place a static "Search in library" pill below it with a 14px search icon. Keep the title pinned to the bottom and treat the pill as explanatory artwork rather than a working input.`,
    script: `function ProjectLibraryCard() {
  return <article className="c1-card c1-card-3">
    <div className="c1-mesh" aria-hidden />
    <img className="c1-folder" src={FOLDER_SVG} alt="Project library folder" />
    <div className="c1-search" aria-hidden><SearchIcon />Search in library</div>
    <h3>Project Library</h3>
  </article>
}`,
    validations: ['Mesh includes standard and WebKit masks', 'Search cue is not exposed as an input', 'Folder remains centered at all widths', 'External asset failure leaves the title intact'],
    resources: [{ label: 'Library folder illustration', url: 'https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg', note: 'Folder artwork used inside the card.' }],
  },
  {
    id: 'studio-hero', preset: 'studio', group: 'Brand & Layout', number: '01', title: 'Studio Hero', category: 'Hero', kind: 'studio-hero',
    summary: 'A narrow editorial introduction pairing clean body type with a serif brand accent.',
    prompt: `Build a centered max-width 440px studio hero on white. Use PP Neue Montreal for body copy and PP Mondwest for the Viktor Oddy logo plus the phrases "next wave" and "bold way." Keep the heading on two nowrap lines, stack three descriptive paragraphs, and finish with primary and secondary pill CTAs. Reveal logo, tagline, heading, copy and actions with 0.1-second stagger increments.`,
    script: `function HeroSection() {
  const { ref, inView } = useInViewAnimation()
  return <section ref={ref} className="mx-auto max-w-[440px] px-6 pt-12">
    <Reveal show={inView} delay={.1}><Logo /></Reveal>
    <Reveal show={inView} delay={.2}><Tagline /></Reveal>
    <Reveal show={inView} delay={.3}><HeroHeading /></Reveal>
    <Reveal show={inView} delay={.4}><StudioIntro /></Reveal>
    <Reveal show={inView} delay={.5}><HeroActions /></Reveal>
  </section>
}`,
    validations: ['Heading remains readable without horizontal clipping', 'Font fallbacks load when custom files fail', 'Stagger triggers once', 'CTA focus states remain visible'],
  },
  {
    id: 'studio-buttons', preset: 'studio', group: 'Brand & Layout', number: '02', title: 'Studio Button System', category: 'Primitive', kind: 'studio-buttons',
    summary: 'Three reusable pill-button variants built around the studio’s layered shadow language.',
    prompt: `Create a Button component with primary, secondary and tertiary variants. All variants use rounded-full, accessible focus-visible rings and disabled states. Primary is #051A24 with white text and the specified five-layer shadow plus inset highlight. Secondary and tertiary remain white with subtle elevation. Accept href for links and preserve the same appearance for button and anchor rendering.`,
    script: `type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'tertiary'
  href?: string
  children: React.ReactNode
}

function Button({ variant='primary', href, children }: ButtonProps) {
  const className = buttonVariants[variant]
  return href
    ? <a href={href} className={className}>{children}</a>
    : <button className={className}>{children}</button>
}`,
    validations: ['Anchor and button semantics are preserved', 'Focus-visible styling is distinct', 'Disabled state blocks interaction', 'Layered shadows use shared tokens'],
  },
  {
    id: 'studio-pricing', preset: 'studio', group: 'Brand & Layout', number: '03', title: 'Pricing Card Pair', category: 'Pricing', kind: 'studio-pricing',
    summary: 'Contrast a monthly partnership with a fixed-scope project using paired dark and light cards.',
    prompt: `Build a responsive PricingSection with two rounded 40px cards. Use a dark Monthly Partnership card and elevated white Custom Project card. Each card owns title, two-line description, price qualifier and CTA list. Stack in one column and switch to two columns at md. Keep booking links external, make repeated pricing data-driven, and reveal the cards with .1s and .2s delays.`,
    script: `const plans = [
  { theme:'dark', title:'Monthly Partnership', price:'$5,000', unit:'Monthly' },
  { theme:'light', title:'Custom Project', price:'$5,000', unit:'Minimum' },
]

function PricingSection() {
  return <section className="grid gap-8 md:grid-cols-2">
    {plans.map((plan, index) => <PricingCard
      key={plan.title} plan={plan} delay={(index + 1) * .1}
    />)}
  </section>
}`,
    validations: ['Plans render from data', 'Dark and light contrast passes', 'Booking URL is consistent', 'Mobile card padding does not squeeze copy'],
  },
  {
    id: 'studio-marquee', preset: 'studio', group: 'Scroll & Motion', number: '04', title: 'Infinite GIF Marquee', category: 'Loop', kind: 'studio-marquee',
    summary: 'Duplicate a project rail once and translate exactly half its width for a seamless loop.',
    prompt: `Create a full-width overflow-hidden marquee using eight project GIFs duplicated once. Render a single flex rail and animate from translateX(0) to translateX(-50%). Use 30 seconds on desktop and 10 seconds on mobile. Images are rounded, shadowed and fixed-height. Pause when the document is hidden and disable continuous motion for prefers-reduced-motion.`,
    script: `const loopItems = [...images, ...images]

<div className="overflow-hidden">
  <div className="studio-marquee flex w-max">
    {loopItems.map((src, index) => <img key={index} src={src} alt="" />)}
  </div>
</div>

@keyframes studioMarquee { to { transform:translateX(-50%); } }
.studio-marquee { animation:studioMarquee 30s linear infinite; }`,
    validations: ['Rail content is duplicated exactly once', 'No visible seam at loop boundary', 'Reduced motion stops the loop', 'Offscreen or hidden tabs pause expensive GIF work'],
  },
  {
    id: 'studio-stagger', preset: 'studio', group: 'Scroll & Motion', number: '05', title: 'In-View Stagger', category: 'Entrance', kind: 'studio-stagger',
    summary: 'A single reusable observer contract for one-time section entrances and child delays.',
    prompt: `Create useInViewAnimation with IntersectionObserver threshold .1 and a once-only default. Return a ref and inView boolean. Apply animate-fade-in-up only after entry, keep opacity zero before entry, and let child elements supply animationDelay values. Disconnect the observer on reveal or unmount. Immediately show content when reduced motion is enabled.`,
    script: `function useInViewAnimation() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect() }
    }, { threshold: .1 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return { ref, inView }
}`,
    validations: ['Observer disconnects after first reveal', 'No state update after unmount', 'Reduced motion bypasses transforms', 'Content is not permanently hidden without JavaScript'],
  },
  {
    id: 'studio-parallax', preset: 'studio', group: 'Scroll & Motion', number: '06', title: 'Quote Parallax', category: 'Parallax', kind: 'studio-parallax',
    summary: 'Pair a large editorial quote with a portrait that moves gently relative to viewport position.',
    prompt: `Build a TestimonialSection with a Quote icon, large serif-accented statement, author, three company names and a portrait. Observe the portrait before attaching a passive scroll listener. Schedule measurements through requestAnimationFrame, clamp vertical offset to 200px, and clean up listeners plus frames on exit or unmount. Disable the transform for reduced motion.`,
    script: `function onScroll() {
  if (frame.current) return
  frame.current = requestAnimationFrame(() => {
    const rect = image.current.getBoundingClientRect()
    const progress = 1 - rect.top / window.innerHeight
    setOffset(clamp(progress * 200, 0, 200))
    frame.current = null
  })
}`,
    validations: ['Scroll listener is passive and visibility-gated', 'Offset clamps to 200px', 'RAF and listener are cleaned up', 'Reduced motion removes parallax'],
  },
  {
    id: 'studio-projects', preset: 'studio', group: 'Scroll & Motion', number: '07', title: 'Project Showcase Stack', category: 'Portfolio', kind: 'studio-projects',
    summary: 'Render data-driven project stories as an editorial vertical stack with individual reveals.',
    prompt: `Create a max-width 1200px ProjectsSection from project data. Each ProjectItem contains an offset serif title, supporting description and full-width rounded GIF. Give every item its own IntersectionObserver reveal rather than revealing the entire list at once. Preserve source order and meaningful image alt text.`,
    script: `const projects = [
  { name:'evr', description:'From idea to millions raised for a web3 AI product', image:EVR_GIF },
  { name:'Automation Machines', description:'Streamlining industrial automation processes', image:AUTOMATION_GIF },
  { name:'xPortfolio', description:'Modern portfolio management platform', image:XPORTFOLIO_GIF },
]

function ProjectsSection() {
  return <section>{projects.map(project =>
    <ProjectItem key={project.name} project={project} />)}</section>
}`,
    validations: ['Projects render from data', 'Each item observes independently', 'GIFs reserve aspect-ratio space', 'Alternative text describes the project'],
  },
  {
    id: 'studio-carousel', preset: 'studio', group: 'Interactive Systems', number: '08', title: 'Testimonial Carousel', category: 'Carousel', kind: 'studio-carousel',
    summary: 'An auto-advancing, hover-pausable testimonial rail with manual controls and infinite recentering.',
    prompt: `Build a testimonial carousel from five records tripled into a looping rail. Advance every three seconds, pause on hover and expose labeled previous/next buttons. Use 427.5px desktop cards with 24px gap and a .8s cubic-bezier transition. After reaching a cloned boundary, disable transition, recenter to the matching middle item, then restore transition. Support keyboard focus and reduced motion.`,
    script: `const loop = [...testimonials, ...testimonials, ...testimonials]
const [index, setIndex] = useState(testimonials.length)

useEffect(() => {
  if (paused) return
  const timer = window.setInterval(() => setIndex(i => i + 1), 3000)
  return () => window.clearInterval(timer)
}, [paused])

// On transitionEnd, recenter cloned boundary without animation.`,
    validations: ['Interval clears on pause and unmount', 'Clone boundary recenters without a visible jump', 'Controls have accessible labels', 'Reduced motion disables auto-advance'],
  },
  {
    id: 'studio-mouse-trail', preset: 'studio', group: 'Interactive Systems', number: '09', title: 'Partner Mouse Trail', category: 'Pointer', kind: 'studio-mouse-trail',
    summary: 'Spawn short-lived project thumbnails behind a centered partnership CTA as the pointer moves.',
    prompt: `Build a large PartnerSection with centered serif heading and CTA. For fine pointers, spawn a project GIF at the cursor no more than once every 80ms. Give each thumbnail a random rotation from -10 to 10 degrees, animate opacity and scale to zero over one second, then remove it. Cap the active trail count, ignore coarse pointers, and cancel timers or animation frames on unmount.`,
    script: `function spawnTrail(x, y) {
  if (performance.now() - lastSpawn.current < 80) return
  lastSpawn.current = performance.now()
  const item = { id: crypto.randomUUID(), x, y, rotate: random(-10, 10) }
  setTrail(current => [...current.slice(-10), item])
  window.setTimeout(() => removeTrail(item.id), 1000)
}`,
    validations: ['Spawn interval is at least 80ms', 'Active thumbnail count is capped', 'Disabled for coarse pointers and reduced motion', 'All cleanup timers are cleared'],
  },
  {
    id: 'studio-footer-nav', preset: 'studio', group: 'Conversion & Navigation', number: '10', title: 'Footer & Floating Nav', category: 'Navigation', kind: 'studio-footer-nav',
    summary: 'Close the page with grouped links, copyright metadata and a persistent bottom conversion pill.',
    prompt: `Compose Footer, CopyrightBar and BottomNav as independent components. Footer contains a primary CTA plus two semantic link columns. CopyrightBar places company and location at opposite ends. BottomNav is a fixed, centered white pill with the serif V mark and primary CTA, safe-area bottom spacing and z-index 50. External links open safely and anchor links target real section IDs.`,
    script: `function FooterStack() {
  return <>
    <Footer links={footerLinks} />
    <CopyrightBar company="Vortex Studio Limited" location="Austin, USA" />
    <BottomNav brand="V" cta="Start a chat" />
  </>
}`,
    validations: ['Footer uses nav and list semantics', 'External links include rel noopener', 'Bottom pill respects safe-area inset', 'Fixed nav does not cover final page content'],
  },
]

function VideoFadeDemo({ playKey }: { playKey: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (frame.current) cancelAnimationFrame(frame.current)
    const start = performance.now()
    const run = (now: number) => {
      const elapsed = now - start
      const opacity = elapsed < 550 ? elapsed / 550 : elapsed < 1500 ? 1 : Math.max(0, 1 - (elapsed - 1500) / 550)
      video.style.opacity = String(opacity)
      if (elapsed < 2050) frame.current = requestAnimationFrame(run)
    }
    video.currentTime = 0
    void video.play().catch(() => undefined)
    frame.current = requestAnimationFrame(run)
    return () => { if (frame.current) cancelAnimationFrame(frame.current) }
  }, [playKey])

  return <video ref={ref} src={VIDEO_URL} muted playsInline className="h-full w-full object-cover" style={{ transform: 'scale(1.08) translateY(8%)' }} />
}

function MagnetDemo() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPosition({ x: (event.clientX - rect.left - rect.width / 2) / 4, y: (event.clientY - rect.top - rect.height / 2) / 4 })
  }
  return (
    <div className="flex h-full items-center justify-center" onMouseMove={move} onMouseLeave={() => setPosition({ x: 0, y: 0 })}>
      <motion.div animate={position} transition={{ type: 'spring', stiffness: 180, damping: 16 }} className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 shadow-[0_20px_50px_#a855f766]">
        <MousePointer2 className="text-white" size={28} />
      </motion.div>
    </div>
  )
}

function DepthCarouselDemo({ playKey }: { playKey: number }) {
  const [active, setActive] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    TOON_IMAGES.forEach(({ src }) => {
      const image = new Image()
      image.src = src
    })
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (playKey === 0) return
    timeoutRef.current = window.setTimeout(() => {
      setActive((current) => (current + 1) % TOON_IMAGES.length)
    }, 20)
  }, [playKey])

  const roles = {
    center: active,
    left: (active + 3) % 4,
    right: (active + 1) % 4,
    back: (active + 2) % 4,
  }

  return (
    <div
      className="relative h-full overflow-hidden"
      style={{
        backgroundColor: TOON_IMAGES[active].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div className="absolute inset-x-0 top-[22%] z-[1] text-center font-['Kanit'] text-[42px] font-black leading-none text-white/80">
        3D SHAPE
      </div>
      {TOON_IMAGES.map((image, index) => {
        const role = index === roles.center ? 'center' : index === roles.left ? 'left' : index === roles.right ? 'right' : 'back'
        const styleByRole = {
          center: { left: '50%', height: '55%', bottom: '0%', transform: 'translateX(-50%) scale(1.25)', filter: 'blur(0)', opacity: 1, zIndex: 20 },
          left: { left: '21%', height: '34%', bottom: '8%', transform: 'translateX(-50%) scale(1)', filter: 'blur(1px)', opacity: .82, zIndex: 10 },
          right: { left: '79%', height: '34%', bottom: '8%', transform: 'translateX(-50%) scale(1)', filter: 'blur(1px)', opacity: .82, zIndex: 10 },
          back: { left: '50%', height: '25%', bottom: '10%', transform: 'translateX(-50%) scale(1)', filter: 'blur(2px)', opacity: .9, zIndex: 5 },
        }[role]
        return (
          <div
            key={image.src}
            className="absolute aspect-square"
            style={{
              ...styleByRole,
              transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
              willChange: 'transform, filter, opacity',
            }}
          >
            <img src={image.src} alt="" draggable={false} className="h-full w-full object-contain object-bottom" />
          </div>
        )
      })}
      <div className="absolute bottom-2 left-3 z-30 text-[8px] font-semibold uppercase tracking-[.2em] text-white">TOONHUB</div>
    </div>
  )
}

function MouseScrubGazeDemo({ playKey }: { playKey: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previousXRef = useRef<number | null>(null)
  const targetTimeRef = useRef(0)
  const seekingRef = useRef(false)

  const queueSeek = () => {
    const video = videoRef.current
    if (!video || seekingRef.current || !Number.isFinite(video.duration)) return
    if (Math.abs(video.currentTime - targetTimeRef.current) < 0.01) return
    seekingRef.current = true
    video.currentTime = targetTimeRef.current
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return
    if (previousXRef.current === null) {
      previousXRef.current = event.clientX
      return
    }

    const width = event.currentTarget.getBoundingClientRect().width
    const delta = event.clientX - previousXRef.current
    previousXRef.current = event.clientX
    const offset = (delta / width) * 0.8 * video.duration
    targetTimeRef.current = Math.min(video.duration, Math.max(0, targetTimeRef.current + offset))
    queueSeek()
  }

  useEffect(() => {
    const video = videoRef.current
    if (playKey === 0 || !video || !Number.isFinite(video.duration)) return
    targetTimeRef.current = video.duration / 2
    seekingRef.current = false
    video.currentTime = targetTimeRef.current
  }, [playKey])

  return (
    <div
      className="relative h-full cursor-ew-resize overflow-hidden bg-[#ddd]"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { previousXRef.current = null }}
    >
      <video
        ref={videoRef}
        src={MAINFRAME_VIDEO}
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-cover object-[70%_center]"
        onLoadedMetadata={(event) => {
          const video = event.currentTarget
          targetTimeRef.current = video.duration / 2
          video.currentTime = targetTimeRef.current
        }}
        onSeeked={() => {
          seekingRef.current = false
          queueSeek()
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[.2em] text-white backdrop-blur-md">
        Move cursor left / right
      </div>
    </div>
  )
}

type ArchiveSide = 'left' | 'right'

function DualVideoScrubDemo({ playKey }: { playKey: number }) {
  const leftRef = useRef<HTMLVideoElement>(null)
  const rightRef = useRef<HTMLVideoElement>(null)
  const targetsRef = useRef<Record<ArchiveSide, number>>({ left: 0, right: 0 })
  const seekingRef = useRef<Record<ArchiveSide, boolean>>({ left: false, right: false })
  const [active, setActive] = useState<ArchiveSide>('left')

  const videoFor = (side: ArchiveSide) => side === 'left' ? leftRef.current : rightRef.current
  const flushSeek = (side: ArchiveSide) => {
    const video = videoFor(side)
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0 || seekingRef.current[side]) return
    const target = Math.min(video.duration, Math.max(0, targetsRef.current[side]))
    if (Math.abs(video.currentTime - target) < .015) return
    seekingRef.current[side] = true
    video.currentTime = target
  }
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    const side: ArchiveSide = ratio < .5 ? 'left' : 'right'
    const localRatio = side === 'left' ? ratio * 2 : (ratio - .5) * 2
    const video = videoFor(side)
    if (!video || !Number.isFinite(video.duration)) return
    targetsRef.current[side] = localRatio * video.duration
    setActive(side)
    flushSeek(side)
  }

  useEffect(() => {
    if (playKey === 0) return
    const videos = [leftRef.current, rightRef.current]
    videos.forEach((video, index) => {
      if (!video || !Number.isFinite(video.duration)) return
      const side: ArchiveSide = index === 0 ? 'left' : 'right'
      targetsRef.current[side] = video.duration / 2
      seekingRef.current[side] = false
      video.currentTime = targetsRef.current[side]
    })
  }, [playKey])

  const video = (side: ArchiveSide, ref: typeof leftRef) => (
    <div className={`relative h-full overflow-hidden transition-opacity duration-300 ${active === side ? 'opacity-100' : 'opacity-45'}`}>
      <video
        ref={ref}
        src={ARCHIVE_VIDEOS[side]}
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        onLoadedMetadata={(event) => {
          const element = event.currentTarget
          targetsRef.current[side] = element.duration / 2
          element.currentTime = targetsRef.current[side]
        }}
        onSeeked={() => {
          seekingRef.current[side] = false
          flushSeek(side)
        }}
      />
      <span className="pointer-events-none absolute bottom-3 left-3 text-[8px] font-semibold uppercase tracking-[.22em] text-white">{side}</span>
    </div>
  )

  return (
    <div className="relative grid h-full cursor-ew-resize grid-cols-2 overflow-hidden bg-stone-900" onPointerMove={handlePointerMove}>
      {video('left', leftRef)}
      {video('right', rightRef)}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white/50" />
      <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-1 text-[7px] uppercase tracking-[.18em] text-white/75 backdrop-blur">scrub</div>
    </div>
  )
}

function DeadZoneDemo({ playKey }: { playKey: number }) {
  const [active, setActive] = useState<ArchiveSide>('left')
  const [neutral, setNeutral] = useState(false)

  useEffect(() => {
    if (playKey > 0) setActive(playKey % 2 ? 'right' : 'left')
  }, [playKey])

  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    setNeutral(ratio >= .42 && ratio <= .58)
    if (ratio < .42) setActive('left')
    if (ratio > .58) setActive('right')
  }

  return (
    <div className="relative flex h-full overflow-hidden bg-[#d8d2c8] text-[#171512]" onPointerMove={move} onPointerLeave={() => setNeutral(false)}>
      {(['left', 'right'] as ArchiveSide[]).map((side) => (
        <motion.div key={side} animate={{ opacity: active === side ? 1 : .25, scale: active === side ? 1 : .96 }} className={`flex flex-1 items-center justify-center ${side === 'left' ? 'bg-[#b7aa98]' : 'bg-[#dad3c8]'}`}>
          <span className="text-[9px] font-bold uppercase tracking-[.28em]">{side} film</span>
        </motion.div>
      ))}
      <motion.div animate={{ opacity: neutral ? 1 : .35 }} className="pointer-events-none absolute inset-y-0 left-[42%] right-[42%] flex items-center justify-center border-x border-black/20 bg-white/35 backdrop-blur-sm">
        <span className="-rotate-90 whitespace-nowrap text-[7px] font-bold uppercase tracking-[.2em]">hold / reset</span>
      </motion.div>
    </div>
  )
}

function ScrollPhasesDemo({ playKey }: { playKey: number }) {
  const phases = [
    { label: '01 / Intro', color: '#e7e0d5', y: 0 },
    { label: '02 / Archive', color: '#93816f', y: 12 },
    { label: '03 / Exit', color: '#292622', y: 24 },
  ]
  return (
    <div className="relative h-full overflow-hidden bg-[#11100f]">
      {phases.map((phase, index) => (
        <motion.div
          key={`${playKey}-${phase.label}`}
          initial={{ opacity: index === 0 ? 1 : 0, y: 36 }}
          animate={{ opacity: [index === 0 ? 1 : 0, 1, 1, index === 2 ? 1 : 0], y: [36, phase.y, phase.y, phase.y - 12] }}
          transition={{ duration: 2.4, times: [0, .22 + index * .12, .62 + index * .1, 1], ease: 'easeInOut' }}
          className="absolute inset-x-7 top-8 flex h-24 items-end rounded-sm p-3 shadow-2xl"
          style={{ backgroundColor: phase.color, zIndex: index + 1 }}
        >
          <span className={`text-[9px] font-bold uppercase tracking-[.22em] ${index === 2 ? 'text-white' : 'text-black'}`}>{phase.label}</span>
        </motion.div>
      ))}
      <div className="absolute inset-x-7 bottom-5 h-px bg-white/15"><motion.div key={playKey} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.4, ease: 'linear' }} className="h-px bg-white" /></div>
    </div>
  )
}

function ProceduralGridDemo({ playKey }: { playKey: number }) {
  const heights = [72, 104, 56, 88, 64, 112, 76, 92, 60, 100, 68, 84]
  const columnHeights = [0, 0, 0]
  const columns: { height: number; index: number }[][] = [[], [], []]

  heights.forEach((height, index) => {
    const shortest = columnHeights.indexOf(Math.min(...columnHeights))
    columns[shortest].push({ height, index })
    columnHeights[shortest] += height + 6
  })

  return (
    <div className="relative h-full overflow-hidden bg-[#d8d1c5] px-3">
      <div className="grid grid-cols-3 gap-1.5">
        {columns.map((column, columnIndex) => (
          <motion.div
            key={`${playKey}-column-${columnIndex}`}
            initial={{ y: 34 + columnIndex * 14 }}
            animate={{ y: -54 - columnIndex * 7 }}
            transition={{ duration: 2.35, delay: columnIndex * .08, ease: [.22, 1, .36, 1] }}
            className="space-y-1.5"
          >
            {column.map((tile, rowIndex) => (
              <motion.div
                key={tile.index}
                initial={{ opacity: 0, scale: .94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: columnIndex * .07 + rowIndex * .12, duration: .42 }}
                className={`relative overflow-hidden rounded-sm ${['bg-[#292621]', 'bg-[#9b8b77]', 'bg-[#6e6257]', 'bg-[#b8aa96]'][tile.index % 4]}`}
                style={{ height: tile.height }}
              >
                <div className="absolute inset-x-2 top-2 h-px bg-white/25" />
                <span className="absolute bottom-2 left-2 text-[6px] font-semibold uppercase tracking-[.16em] text-white/75">Look {String(tile.index + 1).padStart(2, '0')}</span>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-[#d8d1c5] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#d8d1c5] via-[#d8d1c5]/85 to-transparent" />
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-[7px] font-bold uppercase tracking-[.2em] text-[#292621]">
        <span>Waterfall archive</span><span>Shortest column</span>
      </div>
    </div>
  )
}

function ViewportScaleDemo({ playKey }: { playKey: number }) {
  const [focus, setFocus] = useState(1)
  useEffect(() => {
    if (playKey > 0) setFocus(playKey % 3)
  }, [playKey])
  return (
    <div className="flex h-full items-center gap-2 overflow-hidden bg-[#151412] px-4">
      {[0, 1, 2].map((item) => (
        <motion.div
          key={item}
          animate={{ scale: focus === item ? 1 : .86, opacity: focus === item ? 1 : .48, y: focus === item ? 0 : 8 }}
          transition={{ duration: .55, ease: [.25, .1, .25, 1] }}
          onPointerEnter={() => setFocus(item)}
          className={`h-28 min-w-20 flex-1 rounded-sm border border-white/10 ${['bg-[#b5a590]', 'bg-[#736659]', 'bg-[#d5cec2]'][item]}`}
        >
          <div className="flex h-full items-end p-2 text-[7px] font-bold uppercase tracking-[.18em] text-black/70">Look {item + 1}</div>
        </motion.div>
      ))}
    </div>
  )
}

function ExclusionUIDemo({ playKey }: { playKey: number }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#d8d0c4] text-white">
      <div className="absolute inset-x-0 top-0 z-30 flex h-9 items-center justify-between bg-black px-3 text-[7px] uppercase tracking-[.2em]"><span>Archive</span><span>Index</span></div>
      <motion.div key={playKey} initial={{ x: '-85%', rotate: -4 }} animate={{ x: '28%', rotate: 2 }} transition={{ duration: 1.5, ease: [.22, 1, .36, 1] }} className="absolute inset-y-5 z-20 w-3/4 bg-[#6f6256] shadow-2xl">
        <div className="absolute inset-3 border border-white/25" />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 z-30 flex h-9 items-center justify-between bg-black px-3 text-[7px] uppercase tracking-[.2em]"><span>Collection 04</span><span>2026</span></div>
    </div>
  )
}

function CustomCursorDemo() {
  const x = useMotionValue(150)
  const y = useMotionValue(80)
  const springX = useSpring(x, { stiffness: 500, damping: 35 })
  const springY = useSpring(y, { stiffness: 500, damping: 35 })
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="relative grid h-full cursor-none grid-cols-2 overflow-hidden bg-[#d5cfc4] p-3"
      onPointerEnter={() => setVisible(true)}
      onPointerLeave={() => { setVisible(false); setHovered(false) }}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        x.set(event.clientX - rect.left)
        y.set(event.clientY - rect.top)
      }}
    >
      {['View', 'Open'].map((label, index) => <div key={label} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} className={`m-1 flex items-end p-2 text-[8px] font-bold uppercase tracking-[.2em] ${index ? 'bg-[#837466] text-white' : 'bg-[#b4a691] text-black'}`}>{label}</div>)}
      <motion.div aria-hidden animate={{ opacity: visible ? 1 : 0, scale: hovered ? 1.35 : 1 }} style={{ left: springX, top: springY }} className="pointer-events-none absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/75 text-[6px] uppercase tracking-[.16em] text-white backdrop-blur">
        {hovered ? 'View' : 'Move'}
      </motion.div>
    </div>
  )
}

function ScrollOutroDemo({ playKey }: { playKey: number }) {
  return (
    <div className="relative h-full overflow-hidden bg-[#e2ddd4]">
      <motion.div key={`stage-${playKey}`} initial={{ scale: 1, y: 0, opacity: 1 }} animate={{ scale: .82, y: -24, opacity: .72 }} transition={{ duration: 1.25, ease: [.22, 1, .36, 1] }} className="absolute inset-x-5 top-4 z-20 h-28 origin-top bg-[#5d5147] p-3 text-white shadow-xl">
        <span className="text-[8px] uppercase tracking-[.22em]">Final look</span>
        <div className="mt-3 h-px bg-white/30" />
      </motion.div>
      <motion.footer key={`footer-${playKey}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .65 }} className="absolute inset-x-0 bottom-0 z-30 flex h-14 items-center justify-between bg-black px-4 text-[8px] uppercase tracking-[.2em] text-white">
        <span>End of archive</span><ArrowRight size={12} />
      </motion.footer>
    </div>
  )
}

function PromptSuggestionCardDemo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative h-full overflow-hidden text-left text-slate-900 shadow-[0_5px_14px_-6px_rgba(0,0,0,.18)] ${compact ? 'rounded-lg' : ''}`} style={{ background: 'radial-gradient(circle at 50% 0%,#FFB347 0%,#F9ED96 30%,#F4F8F9 66%)' }}>
      <div className={`absolute rounded bg-white leading-[1.5] text-slate-600 shadow-sm ${compact ? 'left-1.5 right-1.5 top-2 p-1.5 text-[4px]' : 'left-5 right-5 top-5 p-3 text-[8px]'}`}>A bright 3D illustration of a <span className="bg-gradient-to-r from-[#FFB347] to-[#E5A1F5] bg-clip-text font-semibold text-transparent">cheerful cartoon girl centred against a</span> smooth blue background</div>
      <div className={`absolute flex items-center rounded-full border border-black bg-white font-semibold ${compact ? 'left-2.5 top-[50px] gap-0.5 px-1.5 py-0.5 text-[4px]' : 'left-8 top-[92px] gap-1 px-3 py-1.5 text-[8px]'}`}><span className={`${compact ? 'text-[6px]' : 'text-[11px]'} text-purple-500`}>✦</span>Add more details</div>
      <svg viewBox="0 0 24 24" aria-hidden className={`absolute drop-shadow ${compact ? 'left-[39px] top-[62px] h-3 w-3' : 'left-[94px] top-[117px] h-5 w-5'}`} fill="#0f172a" stroke="white" strokeWidth="1"><path d="M4 2L20 11L11 13L9 22L4 2Z" /></svg>
      <p className={`absolute inset-x-0 bottom-0 font-semibold text-slate-800 ${compact ? 'p-2 text-[6px]' : 'p-5 text-[12px]'}`}>Smart Prompt Suggestions</p>
    </div>
  )
}

function ApiAccessCardDemo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative h-full overflow-hidden text-left text-slate-900 shadow-[0_5px_14px_-6px_rgba(0,0,0,.18)] ${compact ? 'rounded-lg' : ''}`} style={{ background: 'radial-gradient(circle at 50% 0%,#E5A1F5 0%,#F8ACA0 30%,#F4F8F9 66%)' }}>
      <img src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/network.svg" alt="API network" className={`absolute left-1/2 -translate-x-1/2 object-contain ${compact ? 'top-3 h-16 w-[88%]' : 'top-2 h-32 w-[82%]'}`} />
      <p className={`absolute inset-x-0 bottom-0 font-semibold text-slate-800 ${compact ? 'p-2 text-[6px]' : 'p-5 text-[12px]'}`}>API Access</p>
    </div>
  )
}

function ProjectLibraryCardDemo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative h-full overflow-hidden text-left text-slate-900 shadow-[0_5px_14px_-6px_rgba(0,0,0,.18)] ${compact ? 'rounded-lg' : ''}`} style={{ background: 'radial-gradient(circle at 50% 0%,#F9ED96 0%,#E5A1F5 30%,#F4F8F9 66%)' }}>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px)', backgroundSize: compact ? '8px 8px' : '16px 16px', WebkitMaskImage: 'radial-gradient(circle at center top,black 0%,transparent 80%)', maskImage: 'radial-gradient(circle at center top,black 0%,transparent 80%)' }} />
      <img src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg" alt="Project library folder" className={`absolute left-1/2 -translate-x-1/2 object-contain drop-shadow ${compact ? 'top-3 h-14 w-16' : 'top-2 h-24 w-28'}`} />
      <div className={`absolute left-1/2 flex -translate-x-1/2 items-center whitespace-nowrap rounded-full border border-black bg-white font-medium ${compact ? 'top-[68px] gap-1 px-1.5 py-0.5 text-[4px]' : 'top-[105px] gap-1.5 px-3 py-1.5 text-[8px]'}`}><Search size={compact ? 6 : 11} />Search in library</div>
      <p className={`absolute inset-x-0 bottom-0 font-semibold text-slate-800 ${compact ? 'p-2 text-[6px]' : 'p-5 text-[12px]'}`}>Project Library</p>
    </div>
  )
}

function CoreFeaturesSectionDemo() {
  return (
    <div className="h-full overflow-hidden bg-white px-3 py-2 text-center text-slate-900" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui' }}>
      <p className="bg-gradient-to-r from-[#F5C344] via-[#F28482] to-[#B567C2] bg-clip-text text-[6px] font-semibold uppercase tracking-[.18em] text-transparent">Core Features</p>
      <h3 className="mt-0.5 text-[12px] font-medium tracking-[-.02em]">Built for Speed &amp; Quality</h3>
      <p className="mt-0.5 text-[6px] leading-tight text-slate-500">Everything you need to go<br />from idea to image</p>
      <div className="mt-2 grid h-[116px] grid-cols-3 gap-1.5">
        <PromptSuggestionCardDemo compact />
        <ApiAccessCardDemo compact />
        <ProjectLibraryCardDemo compact />
      </div>
    </div>
  )
}

const mondwestStyle = { fontFamily: "'PP Mondwest', 'Instrument Serif', serif" }

function StudioHeroDemo({ playKey }: { playKey: number }) {
  const reveal = (delay: number) => ({ delay, duration: .55, ease: [.22, 1, .36, 1] as [number, number, number, number] })
  return (
    <div className="h-full overflow-hidden bg-white px-7 py-4 text-[#051A24]">
      <motion.p key={`logo-${playKey}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={reveal(.1)} className="text-xl font-semibold tracking-tight" style={mondwestStyle}>Viktor Oddy</motion.p>
      <motion.p key={`tag-${playKey}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reveal(.2)} className="mt-1 font-mono text-[6px]">The creative studio of Viktor Oddy</motion.p>
      <motion.h3 key={`heading-${playKey}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={reveal(.3)} className="mt-2 text-[15px] leading-[1.05] tracking-tight text-[#0D212C]">Build the <span style={mondwestStyle}>next wave,</span><br />the <span style={mondwestStyle}>bold way.</span></motion.h3>
      <motion.p key={`copy-${playKey}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reveal(.4)} className="mt-2 max-w-[230px] text-[6px] leading-relaxed">A deliberately small studio bringing product thinking to innovators shaping what comes next.</motion.p>
      <motion.div key={`actions-${playKey}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={reveal(.5)} className="mt-3 flex gap-2"><span className="rounded-full bg-[#051A24] px-3 py-1.5 text-[6px] font-medium text-white shadow-lg">Start a chat</span><span className="rounded-full bg-white px-3 py-1.5 text-[6px] shadow-md">View projects</span></motion.div>
    </div>
  )
}

function StudioButtonsDemo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#f7fafb] text-[#051A24]">
      <div className="rounded-full bg-[#051A24] px-6 py-3 text-[9px] font-medium text-white shadow-[0_1px_2px_rgba(5,26,36,.1),0_4px_4px_rgba(5,26,36,.09),0_9px_6px_rgba(5,26,36,.05),inset_0_2px_8px_rgba(255,255,255,.5)]">Primary / Start a chat</div>
      <div className="rounded-full bg-white px-6 py-3 text-[9px] font-medium shadow-[0_0_0_.5px_rgba(0,0,0,.05),0_4px_30px_rgba(0,0,0,.08)]">Secondary / View projects</div>
      <div className="rounded-full bg-white px-6 py-2 text-[8px] font-medium shadow-[0_3px_12px_rgba(0,0,0,.12)]">Tertiary / How it works</div>
    </div>
  )
}

function StudioPricingDemo({ playKey }: { playKey: number }) {
  return (
    <div className="grid h-full grid-cols-2 gap-2 bg-white p-3 text-[#051A24]">
      {[{ title: 'Monthly Partnership', unit: 'Monthly', dark: true }, { title: 'Custom Project', unit: 'Minimum', dark: false }].map((plan, index) => (
        <motion.div key={`${playKey}-${plan.title}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .1 }} className={`flex flex-col rounded-[22px] p-4 ${plan.dark ? 'bg-[#051A24] text-[#F6FCFF]' : 'bg-white text-[#0D212C] shadow-[0_4px_16px_rgba(0,0,0,.08)]'}`}>
          <p className="text-[9px] font-medium">{plan.title}</p><p className={`mt-2 text-[6px] leading-relaxed ${plan.dark ? 'text-[#E0EBF0]' : 'text-[#273C46]'}`}>Same team,<br />same standards.</p><p className="mt-auto text-sm">$5,000</p><p className="text-[6px] opacity-60">{plan.unit}</p><span className={`mt-2 w-fit rounded-full px-2.5 py-1 text-[6px] ${plan.dark ? 'bg-white text-[#051A24]' : 'bg-[#051A24] text-white'}`}>Start a chat</span>
        </motion.div>
      ))}
    </div>
  )
}

function StudioMarqueeDemo({ playKey }: { playKey: number }) {
  const images = [...STUDIO_GIFS.slice(0, 4), ...STUDIO_GIFS.slice(0, 4)]
  return (
    <div className="flex h-full items-center overflow-hidden bg-white">
      <motion.div key={playKey} className="flex w-max gap-3 px-3" animate={{ x: [0, -652] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
        {images.map((src, index) => <img key={`${src}-${index}`} src={src} alt="" className="h-32 w-40 shrink-0 rounded-xl object-cover shadow-lg" />)}
      </motion.div>
    </div>
  )
}

function StudioStaggerDemo({ playKey }: { playKey: number }) {
  return (
    <div className="flex h-full items-center justify-center gap-3 bg-white px-5">
      {['Observe', 'Reveal', 'Disconnect'].map((label, index) => <motion.div key={`${playKey}-${label}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 + index * .13, duration: .55 }} className="flex h-24 flex-1 items-end rounded-2xl bg-[#edf2f4] p-3 text-[7px] font-semibold uppercase tracking-[.15em] text-[#051A24] shadow-sm"><span><span className="mb-2 block font-mono text-[16px]">0{index + 1}</span>{label}</span></motion.div>)}
    </div>
  )
}

function StudioParallaxDemo({ playKey }: { playKey: number }) {
  return (
    <div className="grid h-full grid-cols-[1.15fr_.85fr] items-center gap-3 overflow-hidden bg-white px-5 text-[#0D212C]">
      <div><Quote size={15} /><motion.p key={`quote-${playKey}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[13px] leading-[1.05] tracking-tight">I left <span style={mondwestStyle}>Apple</span> to build the studio I wanted.</motion.p><p className="mt-3 text-[6px] italic text-[#273C46]">Viktor Oddy</p><p className="mt-2 text-[7px] font-medium">Apple · IDEO · Polygon</p></div>
      <motion.img key={`portrait-${playKey}`} initial={{ y: -18 }} animate={{ y: 18 }} transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260330_103804_7aa5494f-4d5b-432e-9dc7-20715275f143.png&w=1280&q=85" alt="Studio founder portrait" className="h-36 w-full rounded-2xl object-cover shadow-lg" />
    </div>
  )
}

function StudioProjectsDemo({ playKey }: { playKey: number }) {
  const projects = [
    { name: 'evr', image: 'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif' },
    { name: 'Automation Machines', image: 'https://motionsites.ai/assets/hero-automation-machines-preview-DlTveRIN.gif' },
    { name: 'xPortfolio', image: 'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif' },
  ]
  return (
    <div className="flex h-full gap-2 overflow-hidden bg-white p-3 text-[#051A24]">
      {projects.map((project, index) => <motion.div key={`${playKey}-${project.name}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: index * 8 }} transition={{ delay: index * .14 }} className="min-w-0 flex-1"><p className="mb-2 truncate text-[8px] font-semibold" style={mondwestStyle}>{project.name}</p><img src={project.image} alt={project.name} className="h-28 w-full rounded-xl object-cover shadow-lg" /></motion.div>)}
    </div>
  )
}

const studioTestimonials = [
  { name: 'Marcus Anderson', role: 'CEO, Data.storage', quote: 'Designs were consistently spot on.' },
  { name: 'alexwu', role: 'Founder, Nexgate', quote: 'Our best fundraising deck to date.' },
  { name: 'Rachel Foster', role: 'Co-founder, Nexus Labs', quote: 'The quality exceeded expectations.' },
]

function StudioCarouselDemo() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % studioTestimonials.length), 3000)
    return () => window.clearInterval(timer)
  }, [paused])
  const item = studioTestimonials[index]
  return (
    <div className="relative h-full overflow-hidden bg-white p-4 text-[#0D212C]" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
      <div className="flex items-center justify-between"><p className="text-[12px]">What <span style={mondwestStyle}>builders</span> say</p><div className="flex items-center gap-0.5">{[0,1,2,3,4].map((star) => <Star key={star} size={7} fill="black" />)}<span className="ml-1 text-[6px]">Clutch 5/5</span></div></div>
      <AnimatePresence mode="wait"><motion.div key={item.name} initial={{ opacity: 0, scale: .94, x: 25 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: .94, x: -25 }} transition={{ duration: .5 }} className="mt-3 rounded-2xl bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,.08)]"><Quote size={11} /><p className="mt-2 text-[8px] leading-relaxed">“{item.quote}”</p><p className="mt-3 text-[7px] font-semibold">{item.name}</p><p className="text-[6px] text-[#273C46]">→ {item.role}</p></motion.div></AnimatePresence>
      <div className="absolute bottom-3 left-3 flex gap-1"><button type="button" aria-label="Previous testimonial" onClick={() => setIndex((index - 1 + studioTestimonials.length) % studioTestimonials.length)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#0D212C]/20"><ChevronLeft size={11} /></button><button type="button" aria-label="Next testimonial" onClick={() => setIndex((index + 1) % studioTestimonials.length)} className="flex h-7 w-7 items-center justify-center rounded-full border border-[#0D212C]/20"><ChevronRight size={11} /></button></div>
    </div>
  )
}

type TrailItem = { id: number; x: number; y: number; rotate: number; src: string }

function StudioMouseTrailDemo() {
  const [trail, setTrail] = useState<TrailItem[]>([])
  const lastSpawnRef = useRef(0)
  const idRef = useRef(0)
  const timersRef = useRef<Set<number>>(new Set())
  useEffect(() => () => { timersRef.current.forEach((timer) => window.clearTimeout(timer)) }, [])
  const move = (event: ReactPointerEvent<HTMLDivElement>) => {
    const now = performance.now()
    if (now - lastSpawnRef.current < 80) return
    lastSpawnRef.current = now
    const rect = event.currentTarget.getBoundingClientRect()
    const id = idRef.current++
    const item = { id, x: event.clientX - rect.left, y: event.clientY - rect.top, rotate: (id % 5) * 5 - 10, src: STUDIO_GIFS[id % STUDIO_GIFS.length] }
    setTrail((current) => [...current.slice(-8), item])
    const timer = window.setTimeout(() => { setTrail((current) => current.filter((entry) => entry.id !== id)); timersRef.current.delete(timer) }, 1000)
    timersRef.current.add(timer)
  }
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-white text-[#0D212C]" onPointerMove={move}>
      {trail.map((item) => <motion.img key={item.id} initial={{ opacity: .9, scale: 1, rotate: item.rotate }} animate={{ opacity: 0, scale: .45, y: -20 }} transition={{ duration: 1 }} src={item.src} alt="" className="pointer-events-none absolute h-14 w-20 rounded-lg object-cover shadow-lg" style={{ left: item.x - 40, top: item.y - 28 }} />)}
      <div className="relative z-10 text-center"><p className="text-[24px]" style={mondwestStyle}>Partner with us</p><span className="mt-3 inline-flex rounded-full bg-[#051A24] px-4 py-2 text-[7px] text-white shadow-lg">Start chat with Viktor</span></div>
    </div>
  )
}

function StudioFooterNavDemo() {
  return (
    <div className="relative h-full overflow-hidden bg-white px-6 py-5 text-[#051A24]">
      <div className="flex items-start justify-between"><span className="rounded-full bg-[#051A24] px-4 py-2 text-[7px] text-white">Start a chat</span><div className="flex gap-7 text-[7px]"><div className="space-y-1"><p>Services</p><p>Work</p><p>About</p></div><div className="space-y-1"><p className="flex gap-1">x.com <ArrowUpRight size={7} /></p><p className="flex gap-1">LinkedIn <ArrowUpRight size={7} /></p></div></div></div>
      <div className="absolute inset-x-6 bottom-4 flex justify-between border-t border-[#051A24]/10 pt-2 text-[6px]"><span>Vortex Studio Limited</span><span>Austin, USA</span></div>
      <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,.15)]"><span className="text-[14px]" style={mondwestStyle}>V</span><span className="rounded-full bg-[#051A24] px-3 py-1.5 text-[6px] text-white">Start a chat</span></div>
    </div>
  )
}

function EffectPreview({ kind, playKey }: { kind: PreviewKind; playKey: number }) {
  if (kind === 'video-fade') return <VideoFadeDemo playKey={playKey} />
  if (kind === 'focus-shift') return (
    <div className="relative h-full overflow-hidden bg-slate-950">
      <motion.div key={playKey} initial={{ y: '-18%' }} animate={{ y: '17%' }} transition={{ duration: 1.2, ease: [0.25,.1,.25,1] }} className="absolute inset-[-15%] bg-[radial-gradient(circle_at_58%_45%,#c084fc_0%,#4c1d95_22%,#111827_58%,#020617_100%)]">
        <div className="absolute left-[58%] top-[44%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 shadow-[0_0_45px_#d8b4fe]" />
      </motion.div>
      <div className="absolute inset-x-4 top-1/2 h-px bg-white/30"><span className="absolute -top-4 right-0 font-mono text-[9px] text-white/50">focal line</span></div>
    </div>
  )
  if (kind === 'liquid-glass') return (
    <div className="relative h-full overflow-hidden bg-[#111827]">
      <motion.div key={playKey} initial={{ x: -80, rotate: 0 }} animate={{ x: 210, rotate: 180 }} transition={{ duration: 2.2, ease: 'easeInOut' }} className="absolute top-8 h-24 w-24 rounded-full bg-gradient-to-br from-fuchsia-500 to-orange-400 blur-sm" />
      <div className="liquid-glass absolute inset-x-8 top-1/2 flex -translate-y-1/2 items-center justify-between rounded-full px-5 py-3 text-xs"><span>Liquid surface</span><ArrowRight size={15} /></div>
    </div>
  )
  if (kind === 'masked-border') return (
    <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_center,#283548,#090b0f_70%)]">
      <motion.div key={playKey} initial={{ scale: .88, opacity: .3 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .8 }} className="liquid-glass flex h-24 w-44 items-center justify-center rounded-3xl text-xs text-white/70">1.4px mask edge</motion.div>
    </div>
  )
  if (kind === 'hero-reveal') return (
    <div className="flex h-full flex-col items-center justify-center bg-black text-center">
      <motion.p key={`eyebrow-${playKey}`} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-[9px] uppercase tracking-[.35em] text-white/40">Introduction</motion.p>
      <motion.h3 key={`heading-${playKey}`} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15, duration: .7 }} className="mt-2 font-serif text-3xl">Built to move</motion.h3>
      <motion.div key={`cta-${playKey}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .5 }} className="mt-4 rounded-full border border-white/20 px-4 py-2 text-[9px] uppercase tracking-widest">Explore</motion.div>
    </div>
  )
  if (kind === 'fallback') return (
    <motion.div key={playKey} initial={{ backgroundPosition: '0% 50%' }} animate={{ backgroundPosition: '100% 50%' }} transition={{ duration: 2 }} className="relative h-full bg-[linear-gradient(120deg,#050505,#273044,#0c0c0c)] bg-[length:200%_200%]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,#000_85%)]" />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[.25em] text-white/55">No media required</div>
    </motion.div>
  )
  if (kind === 'fade-in') return (
    <div className="flex h-full items-center justify-center bg-[#0c0c0c]">
      <motion.div key={playKey} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [.25,.1,.25,1] }} className="rounded-2xl border border-white/10 bg-white/[.06] p-5 shadow-xl"><Sparkles size={25} /><p className="mt-3 text-xs">In viewport</p></motion.div>
    </div>
  )
  if (kind === 'magnet') return <MagnetDemo />
  if (kind === 'marquee') return (
    <div className="flex h-full flex-col justify-center gap-2 overflow-hidden bg-[#0c0c0c]">
      {[1, -1].map((direction, row) => <motion.div key={`${playKey}-${row}`} initial={{ x: direction * -40 }} animate={{ x: direction * 40 }} transition={{ duration: 1.8, ease: 'easeInOut' }} className="flex w-max gap-2">{[0,1,2,3,4].map((item) => <div key={item} className={`h-12 w-20 rounded-lg ${['bg-violet-500','bg-sky-400','bg-orange-400','bg-fuchsia-400','bg-emerald-400'][item]}`} />)}</motion.div>)}
    </div>
  )
  if (kind === 'animated-text') {
    const text = 'MAKE EVERY CHARACTER COUNT.'
    return <div className="flex h-full items-center justify-center bg-[#0c0c0c] px-8"><p className="max-w-xs text-center text-lg font-semibold leading-snug">{text.split('').map((char, index) => <motion.span key={`${playKey}-${index}`} initial={{ opacity: .15 }} animate={{ opacity: 1 }} transition={{ delay: index * .035, duration: .25 }}>{char}</motion.span>)}</p></div>
  }
  if (kind === 'sticky-stack') return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#ddd]">
      {[0,1,2].map((item) => <motion.div key={`${playKey}-${item}`} initial={{ y: 80 + item * 15, scale: 1 }} animate={{ y: item * 13 - 14, scale: 1 - (2-item) * .04 }} transition={{ delay: item * .18, duration: .65 }} className={`absolute h-24 w-44 rounded-2xl border border-black/15 p-4 text-black shadow-xl ${['bg-[#8ea6ff]','bg-[#d0ff8e]','bg-[#ffb18e]'][item]}`}><span className="text-2xl font-black">0{item + 1}</span></motion.div>)}
    </div>
  )
  if (kind === 'depth-carousel') return <DepthCarouselDemo playKey={playKey} />
  if (kind === 'mouse-scrub-gaze') return <MouseScrubGazeDemo playKey={playKey} />
  if (kind === 'dual-video-scrub') return <DualVideoScrubDemo playKey={playKey} />
  if (kind === 'dead-zone') return <DeadZoneDemo playKey={playKey} />
  if (kind === 'scroll-phases') return <ScrollPhasesDemo playKey={playKey} />
  if (kind === 'procedural-grid') return <ProceduralGridDemo playKey={playKey} />
  if (kind === 'viewport-scale') return <ViewportScaleDemo playKey={playKey} />
  if (kind === 'exclusion-ui') return <ExclusionUIDemo playKey={playKey} />
  if (kind === 'custom-cursor') return <CustomCursorDemo />
  if (kind === 'scroll-outro') return <ScrollOutroDemo playKey={playKey} />
  if (kind === 'core-features-section') return <CoreFeaturesSectionDemo />
  if (kind === 'prompt-suggestion-card') return <PromptSuggestionCardDemo />
  if (kind === 'api-access-card') return <ApiAccessCardDemo />
  if (kind === 'project-library-card') return <ProjectLibraryCardDemo />
  if (kind === 'studio-hero') return <StudioHeroDemo playKey={playKey} />
  if (kind === 'studio-buttons') return <StudioButtonsDemo />
  if (kind === 'studio-pricing') return <StudioPricingDemo playKey={playKey} />
  if (kind === 'studio-marquee') return <StudioMarqueeDemo playKey={playKey} />
  if (kind === 'studio-stagger') return <StudioStaggerDemo playKey={playKey} />
  if (kind === 'studio-parallax') return <StudioParallaxDemo playKey={playKey} />
  if (kind === 'studio-projects') return <StudioProjectsDemo playKey={playKey} />
  if (kind === 'studio-carousel') return <StudioCarouselDemo />
  if (kind === 'studio-mouse-trail') return <StudioMouseTrailDemo />
  if (kind === 'studio-footer-nav') return <StudioFooterNavDemo />
  return (
    <div className="flex h-full items-center justify-center overflow-hidden bg-[#0c0c0c]">
      <motion.p key={playKey} initial={{ opacity: .25, backgroundPosition: '0% 0%' }} animate={{ opacity: 1, backgroundPosition: '0% 100%' }} transition={{ duration: 1 }} className="gradient-display bg-[length:100%_200%] text-5xl font-black uppercase leading-none">Jack</motion.p>
    </div>
  )
}

function FeatureCard({ feature, selected, playKey, onSelect, onPlay }: { feature: Feature; selected: boolean; playKey: number; onSelect: () => void; onPlay: () => void }) {
  return (
    <article className={`group overflow-hidden rounded-2xl border bg-[#111] transition-colors ${selected ? 'border-violet-400/60' : 'border-white/[.09] hover:border-white/20'}`}>
      <div className="relative h-44 overflow-hidden border-b border-white/[.08]">
        <EffectPreview kind={feature.kind} playKey={playKey} />
        {feature.preset === 'image-product'
          ? <span className="absolute bottom-3 right-3 rounded-full border border-black/10 bg-white/85 px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[.14em] text-slate-700 shadow-sm backdrop-blur">Static</span>
          : <button type="button" onClick={onPlay} className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md transition-transform hover:scale-105" aria-label={`Play ${feature.title}`}><Play size={14} fill="currentColor" /></button>}
      </div>
      <button type="button" onClick={onSelect} className="w-full p-4 text-left">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[.18em] text-white/35"><span>{feature.number} / {feature.category}</span><ChevronRight size={14} className={`transition-transform ${selected ? 'rotate-90 text-violet-300' : 'group-hover:translate-x-1'}`} /></div>
        <h3 className="mt-3 text-base font-semibold tracking-tight">{feature.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/45">{feature.summary}</p>
      </button>
    </article>
  )
}

function App() {
  const [preset, setPreset] = useState<PresetId>('cinematic')
  const [selectedId, setSelectedId] = useState('video-fade-loop')
  const [detailTab, setDetailTab] = useState<'prompt' | 'script'>('prompt')
  const [query, setQuery] = useState('')
  const [groupFilter, setGroupFilter] = useState('all')
  const [playKeys, setPlayKeys] = useState<Record<string, number>>({})
  const [copied, setCopied] = useState(false)

  const effectGroups = useMemo(() => [...new Set(features.filter((feature) => feature.preset === preset).map((feature) => feature.group))], [preset])
  const visible = useMemo(() => features.filter((feature) => feature.preset === preset
    && (groupFilter === 'all' || feature.group === groupFilter)
    && `${feature.title} ${feature.category} ${feature.group} ${feature.summary}`.toLowerCase().includes(query.toLowerCase())), [preset, query, groupFilter])
  const groupedVisible = useMemo(() => (groupFilter === 'all' ? effectGroups : [groupFilter])
    .map((group) => ({ group, items: visible.filter((feature) => feature.group === group) }))
    .filter(({ items }) => items.length > 0), [effectGroups, groupFilter, visible])
  const selected = visible.find((feature) => feature.id === selectedId) ?? visible[0]

  const switchPreset = (next: PresetId) => {
    setPreset(next)
    setGroupFilter('all')
    setSelectedId(features.find((feature) => feature.preset === next)!.id)
    setDetailTab('prompt')
  }

  const switchGroup = (next: string) => {
    setGroupFilter(next)
    const first = features.find((feature) => feature.preset === preset && (next === 'all' || feature.group === next))
    if (first) setSelectedId(first.id)
  }

  const play = (id: string) => setPlayKeys((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  const playAll = () => setPlayKeys((current) => Object.fromEntries(visible.map((feature) => [feature.id, (current[feature.id] ?? 0) + 1])))
  const copy = async () => {
    if (!selected) return
    await navigator.clipboard.writeText(detailTab === 'prompt' ? selected.prompt : selected.script)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  const presetMeta = preset === 'cinematic'
    ? { title: 'Cinematic Hero', copy: 'Video, glass, focal framing and resilient hero choreography.', icon: Film }
    : preset === 'creator'
      ? { title: 'Creator Portfolio', copy: 'Viewport, pointer and scroll-driven motion for expressive portfolios.', icon: WandSparkles }
      : preset === 'archive'
        ? { title: 'Fashion Archive', copy: 'Dual-film scrubbing, editorial grids and directed archive transitions.', icon: Archive }
        : preset === 'image-product'
          ? { title: 'AI Image Product', copy: 'Composable marketing components for prompt, API and library capabilities.', icon: ImageIcon }
          : { title: 'Viktor Oddy Studio', copy: 'Editorial brand systems, scroll motion and conversion-focused studio interactions.', icon: Palette }
  const PresetIcon = presetMeta.icon

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#080808]/90 px-5 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between">
          <div className="flex items-center gap-3"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black"><Layers3 size={16} /></div><div><p className="text-sm font-semibold">Motion Spec Lab</p><p className="text-[9px] uppercase tracking-[.22em] text-white/35">Prompt × Script × Proof</p></div></div>
          <div className="flex items-center gap-2 text-[11px] text-white/45"><ShieldCheck size={14} className="text-emerald-400" /><span className="hidden sm:inline">Deterministic capability library</span></div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        <section className="grid gap-8 border-b border-white/[.08] pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><p className="mb-3 text-[10px] uppercase tracking-[.25em] text-violet-300">Interactive capability catalog</p><h1 className="max-w-3xl text-3xl font-semibold tracking-[-.04em] sm:text-5xl">Turn visual directions into reusable, testable contracts.</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/45">Every card contains the visible effect, an AI instruction, implementation code, and validation rules. Play the proof before copying the specification.</p></div>
          <button type="button" onClick={playAll} className="flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[.05] px-5 py-3 text-xs font-medium hover:bg-white/10"><Play size={13} fill="currentColor" />Play all effects</button>
        </section>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex w-full overflow-x-auto rounded-xl border border-white/[.08] bg-white/[.03] p-1 md:w-fit">
              {(['cinematic','creator','archive','image-product','studio'] as PresetId[]).map((item) => <button key={item} type="button" onClick={() => switchPreset(item)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-medium transition-colors ${preset === item ? 'bg-white text-black' : 'text-white/45 hover:text-white'}`}>{item === 'cinematic' ? 'Cinematic Hero' : item === 'creator' ? 'Creator Portfolio' : item === 'archive' ? 'Fashion Archive' : item === 'image-product' ? 'AI Image Product' : 'Viktor Oddy Studio'}</button>)}
            </div>
            <label className="flex w-full items-center gap-2 rounded-xl border border-white/[.08] bg-white/[.03] px-3 py-2.5 md:w-64"><Search size={14} className="text-white/30" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter capabilities" className="w-full bg-transparent text-xs outline-none placeholder:text-white/25" /></label>
          </div>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
            <div>
              <div className="mb-5 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.04]"><PresetIcon size={18} /></div><div><h2 className="text-lg font-semibold">{presetMeta.title}</h2><p className="text-xs text-white/40">{presetMeta.copy}</p></div></div>
              <div className="mb-8 flex flex-wrap gap-2" aria-label="Effect groups">
                {['all', ...effectGroups].map((group) => {
                  const count = features.filter((feature) => feature.preset === preset && (group === 'all' || feature.group === group)).length
                  return <button key={group} type="button" onClick={() => switchGroup(group)} className={`rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors ${groupFilter === group ? 'border-violet-300/50 bg-violet-300/15 text-violet-100' : 'border-white/10 bg-white/[.025] text-white/40 hover:border-white/20 hover:text-white/75'}`}>{group === 'all' ? 'All effects' : group}<span className="ml-1.5 font-mono text-[9px] opacity-55">{count}</span></button>
                })}
              </div>
              {visible.length ? <div className="space-y-9">{groupedVisible.map(({ group, items }) => <section key={group} aria-labelledby={`group-${group.replace(/\s+/g, '-').toLowerCase()}`}><div className="mb-3 flex items-center gap-3"><h3 id={`group-${group.replace(/\s+/g, '-').toLowerCase()}`} className="text-[10px] font-semibold uppercase tracking-[.2em] text-white/55">{group}</h3><div className="h-px flex-1 bg-white/[.07]" /><span className="font-mono text-[9px] text-white/25">{String(items.length).padStart(2, '0')}</span></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((feature) => <FeatureCard key={feature.id} feature={feature} selected={selected?.id === feature.id} playKey={playKeys[feature.id] ?? 0} onSelect={() => setSelectedId(feature.id)} onPlay={() => play(feature.id)} />)}</div></section>)}</div> : <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center text-sm text-white/35">No capability matches this filter.</div>}
            </div>

            {selected && <aside className="spec-scroll max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-white/[.09] bg-[#111] lg:sticky lg:top-24">
              <div className="border-b border-white/[.08] p-5"><div className="flex items-center justify-between"><span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-2.5 py-1 text-[9px] uppercase tracking-[.16em] text-violet-200">Capability contract</span><button type="button" onClick={() => play(selected.id)} className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/45 hover:text-white"><RotateCcw size={12} />Replay</button></div><h2 className="mt-4 text-xl font-semibold">{selected.title}</h2><p className="mt-2 text-xs leading-relaxed text-white/45">{selected.summary}</p></div>
              <div className="flex border-b border-white/[.08] p-1.5">{(['prompt','script'] as const).map((tab) => <button key={tab} type="button" onClick={() => setDetailTab(tab)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs capitalize ${detailTab === tab ? 'bg-white/[.08] text-white' : 'text-white/35 hover:text-white'}`}>{tab === 'prompt' ? <Sparkles size={13} /> : <Code2 size={13} />}{tab}</button>)}</div>
              <div className="spec-scroll max-h-[280px] overflow-auto p-5"><AnimatePresence mode="wait"><motion.pre key={`${selected.id}-${detailTab}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="whitespace-pre-wrap font-mono text-[11px] leading-[1.7] text-white/65">{detailTab === 'prompt' ? selected.prompt : selected.script}</motion.pre></AnimatePresence></div>
              <div className="border-t border-white/[.08] p-5">
                <div className="mb-3 flex items-center justify-between"><span className="text-[9px] uppercase tracking-[.2em] text-white/30">Validation gates</span><Glasses size={14} className="text-white/30" /></div>
                <ul className="space-y-2">{selected.validations.map((item) => <li key={item} className="flex gap-2 text-[11px] text-white/50"><Check size={12} className="mt-0.5 shrink-0 text-emerald-400" />{item}</li>)}</ul>

                {selected.production && <div className="mt-5 border-t border-white/[.07] pt-5">
                  <p className="mb-3 text-[9px] uppercase tracking-[.2em] text-white/30">Asset production</p>
                  <ol className="space-y-2.5">{selected.production.map((item, index) => <li key={item} className="flex gap-2.5 text-[11px] leading-relaxed text-white/50"><span className="font-mono text-violet-300">0{index + 1}</span>{item}</li>)}</ol>
                </div>}

                {selected.resources && <div className="mt-5 border-t border-white/[.07] pt-5">
                  <p className="mb-3 text-[9px] uppercase tracking-[.2em] text-white/30">Generation tools</p>
                  <div className="space-y-2">{selected.resources.map((resource) => <a key={resource.label} href={resource.url} target="_blank" rel="noreferrer" className="group flex items-start justify-between gap-3 rounded-lg border border-white/[.07] bg-white/[.025] p-3 hover:border-violet-400/30 hover:bg-violet-400/[.05]"><span><span className="block text-[11px] font-medium text-white/75">{resource.label}</span><span className="mt-1 block text-[10px] leading-relaxed text-white/35">{resource.note}</span></span><ArrowRight size={12} className="mt-0.5 shrink-0 text-white/25 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-300" /></a>)}</div>
                </div>}

                <button type="button" onClick={copy} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-semibold text-black hover:bg-white/85">{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? 'Copied' : `Copy ${detailTab}`}</button>
              </div>
            </aside>}
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
