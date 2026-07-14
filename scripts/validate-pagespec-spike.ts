import { readFileSync } from 'node:fs'
import { validatePageSpec } from '../src/page-builder/validatePageSpec'

type DraftChild = { component: string; props: Record<string, unknown> }
type DraftSection = { id: string; component: string; props: Record<string, unknown>; children?: DraftChild[] }
type DraftSpec = { version: number; theme: string; sections: DraftSection[] }

const sample = JSON.parse(readFileSync(new URL('../generated-pages/sample.json', import.meta.url), 'utf8')) as DraftSpec
const claude2codeSample = JSON.parse(readFileSync(new URL('../generated-pages/sample-claude2code.json', import.meta.url), 'utf8')) as DraftSpec
const cloneSample = () => structuredClone(sample)

const cases: Array<{ name: string; expected: boolean; build: () => unknown }> = [
  { name: 'sample.json is valid', expected: true, build: cloneSample },
  { name: 'sample-claude2code.json is valid', expected: true, build: () => structuredClone(claude2codeSample) },
  {
    name: 'unregistered theme is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.theme = 'neon'
      return spec
    },
  },
  {
    name: 'unknown component id is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[0].component = 'unknown.component'
      return spec
    },
  },
  {
    name: 'extra prop key is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[0].props.extra = true
      return spec
    },
  },
  {
    name: 'className prop is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[0].props.className = 'hidden'
      return spec
    },
  },
  {
    name: 'video domain outside allowlist is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[1].props.src = 'https://example.com/video.mp4'
      return spec
    },
  },
  {
    name: 'external carousel image is rejected', expected: false, build: () => {
      const spec = cloneSample()
      const images = spec.sections[2].props.images as Array<Record<string, unknown>>
      images[0].src = 'https://example.com/image.png'
      return spec
    },
  },
  {
    name: 'carousel traversal path is rejected', expected: false, build: () => {
      const spec = cloneSample()
      const images = spec.sections[2].props.images as Array<Record<string, unknown>>
      images[0].src = '/characters/../secret.png'
      return spec
    },
  },
  {
    name: 'pricing card at top level is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[0] = { id: 'bad-card', component: 'studio.pricing-card', props: spec.sections[4].children![0].props }
      return spec
    },
  },
  {
    name: 'non-card pricing child is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[4].children![0] = { component: 'section.hero', props: { eyebrow: 'Bad', title: 'Child' } }
      return spec
    },
  },
  {
    name: 'duplicate section id is rejected', expected: false, build: () => {
      const spec = cloneSample()
      spec.sections[1].id = spec.sections[0].id
      return spec
    },
  },
]

let failed = false
for (const testCase of cases) {
  const result = validatePageSpec(testCase.build())
  const passed = result.ok === testCase.expected
  console.log(`${passed ? 'PASS' : 'FAIL'} ${testCase.name}`)
  failed ||= !passed
}

if (failed) process.exit(1)
