import type { BehaviorId } from '../behavior-library/registry'
import type { ComponentId } from '../component-library/registry'
import type { ThemeId } from '../component-library/tokens'

export type PageSpecChild = {
  component: ComponentId
  props: unknown
}

// A behavior applied to content. `component` is a BehaviorId; scope decides the mount point.
export type PageSpecBehavior = {
  component: BehaviorId
  props: unknown
}

export type PageSpecSection = {
  id: string
  component: ComponentId
  props: unknown
  children?: PageSpecChild[]
  // 寫法 A — section-scope behaviors applied to this section.
  enhancements?: PageSpecBehavior[]
}

export type PageSpec = {
  version: 1
  theme: ThemeId
  sections: PageSpecSection[]
  // 寫法 C — page-scope behaviors applied to the whole page.
  behaviors?: PageSpecBehavior[]
}
