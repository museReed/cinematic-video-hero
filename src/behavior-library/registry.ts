import type { ReactNode } from 'react'
import type { ZodType } from 'zod/v3'
import {
  inviewEntrancePropsSchema,
  pointerMagnetPropsSchema,
  pointerOverlayPropsSchema,
  scrollDirectorPropsSchema,
} from './schemas'

// A behavior is a wrapper/interaction contract applied *to* content, not a page section itself.
// - scope 'section': attached to one section via `section.enhancements` (寫法 A). `render` wraps that section's children.
// - scope 'page':    attached to the whole page via `page.behaviors` (寫法 C). `render` produces an overlay/orchestrator.
//
// B0 provides metadata + strict propsSchema + scope for validation. The `render` bodies are stubs;
// codex fills the real wrapper/overlay implementations in B6 (section-scope) / B7 (page-scope).

type BehaviorMeta = {
  propsSchema: ZodType
  description: string
  useWhen: string[]
  avoidWhen?: string[]
}

type SectionBehaviorEntry = BehaviorMeta & {
  scope: 'section'
  render: (props: unknown) => (children: ReactNode) => ReactNode
}

type PageBehaviorEntry = BehaviorMeta & {
  scope: 'page'
  render: (props: unknown) => ReactNode
}

export type BehaviorEntry = SectionBehaviorEntry | PageBehaviorEntry

export const behaviorRegistry = {
  'inview-entrance': {
    scope: 'section',
    propsSchema: inviewEntrancePropsSchema,
    description: 'One-time in-view fade/rise entrance with child stagger.',
    useWhen: ['A section should fade in as it enters the viewport'],
    avoidWhen: ['The section already owns its own entrance animation'],
    // B6: wrap children in a whileInView motion contract.
    render: () => (children) => children,
  },
  'pointer-magnet': {
    scope: 'section',
    propsSchema: pointerMagnetPropsSchema,
    description: 'Element subtly follows the pointer within a radius, then eases back.',
    useWhen: ['A portrait or CTA wants magnetic pull on fine pointers'],
    avoidWhen: ['Coarse pointers (auto-disabled)', 'Large full-width blocks'],
    // B6: attach pointer-move translate3d handlers to the wrapped element.
    render: () => (children) => children,
  },
  'pointer-overlay': {
    scope: 'page',
    propsSchema: pointerOverlayPropsSchema,
    description: 'Page-wide editorial pointer feedback: custom cursor or motion trail.',
    useWhen: ['The whole page wants a custom cursor or mouse trail (fine pointers)'],
    avoidWhen: ['Coarse pointers (auto-disabled)', 'Reduced-motion users'],
    // B7: render a fixed overlay above all sections.
    render: () => null,
  },
  'scroll-director': {
    scope: 'page',
    propsSchema: scrollDirectorPropsSchema,
    description: 'Single scroll-progress owner deriving intro/archive/exit phases for multiple sections.',
    useWhen: ['The whole page needs one scroll orchestration across sections, including an outro'],
    avoidWhen: ['Sections already own independent scroll behavior'],
    // B7: own a single scrollYProgress and distribute phase progress to sections.
    render: () => null,
  },
} as const satisfies Record<string, BehaviorEntry>

export type BehaviorId = keyof typeof behaviorRegistry
