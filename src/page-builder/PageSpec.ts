import type { ComponentId } from '../component-library/registry'

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
  theme: 'spike'
  sections: PageSpecSection[]
}
