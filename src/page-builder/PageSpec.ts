import type { ComponentId } from '../component-library/registry'
import type { ThemeId } from '../component-library/tokens'

export type PageSpecChild = {
  component: ComponentId
  props: unknown
}

export type PageSpecSection = {
  id: string
  component: ComponentId
  props: unknown
  children?: PageSpecChild[]
}

export type PageSpec = {
  version: 1
  theme: ThemeId
  sections: PageSpecSection[]
}
