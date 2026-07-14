import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { readFile, rm } from 'node:fs/promises'
import path from 'node:path'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function hasContent(result: Awaited<ReturnType<Client['callTool']>>) {
  return Array.isArray(result.content) && result.content.length > 0
}

function textContent(result: Awaited<ReturnType<Client['callTool']>>) {
  const content = result.content?.[0]
  return content?.type === 'text' ? content.text : ''
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['--import', 'tsx', 'mcp/server.ts'],
  cwd: process.cwd(),
  stderr: 'pipe',
})
const client = new Client({ name: 'component-library-smoke', version: '1.0.0' })
const smokePagePath = path.resolve(process.cwd(), 'generated-pages', 'smoke-e2e.json')
const smokeExportPath = path.resolve(process.cwd(), 'exported-pages', 'smoke-e2e.tsx')

const smokeSpec = {
  version: 1,
  theme: 'studio',
  sections: [
    {
      id: 'opening-hero',
      component: 'section.hero',
      props: { eyebrow: 'Smoke test', title: 'MCP page tools' },
    },
    {
      id: 'moving-message',
      component: 'section.marquee',
      props: { content: 'text', text: 'End to end', speed: 'normal' },
    },
    {
      id: 'core-features',
      component: 'section.feature-grid',
      props: { badge: 'Core Features', title: 'Built for speed and quality' },
      children: [
        {
          component: 'section.feature-card',
          props: { variant: 'prompt', title: 'Smart Prompt Suggestions' },
        },
        {
          component: 'section.feature-card',
          props: { variant: 'library', title: 'Project Library', body: 'Find every saved project.' },
        },
      ],
    },
  ],
}

try {
  await client.connect(transport)
  const listed = await client.listTools()
  assert(listed.tools.length === 7, `Expected 7 tools, received ${listed.tools.length}`)

  const searchResult = await client.callTool({ name: 'searchComponents', arguments: { query: 'hero' } })
  assert(hasContent(searchResult), 'searchComponents returned no content')

  const schemaResult = await client.callTool({ name: 'getComponentSchema', arguments: { componentId: 'section.hero' } })
  assert(hasContent(schemaResult) && !schemaResult.isError, 'getComponentSchema returned an error or no content')

  const tokenResult = await client.callTool({ name: 'listDesignTokens', arguments: {} })
  assert(hasContent(tokenResult), 'listDesignTokens returned no content')
  const tokens = JSON.parse(textContent(tokenResult)) as { themes?: Record<string, Record<string, string>> }
  assert(tokens.themes?.studio, 'listDesignTokens did not return the studio theme')
  assert(tokens.themes?.claude2code, 'listDesignTokens did not return the claude2code theme')
  assert(tokens.themes.studio['--primary'], 'listDesignTokens did not return --primary')
  assert(tokens.themes.studio['--fs-display'], 'listDesignTokens did not return --fs-display')

  const unknownResult = await client.callTool({ name: 'getComponentSchema', arguments: { componentId: 'unknown.component' } })
  assert(unknownResult.isError === true, 'Unknown componentId did not return an MCP error')

  const composeResult = await client.callTool({
    name: 'compose_page',
    arguments: { name: 'smoke-e2e', spec: smokeSpec },
  })
  const compose = JSON.parse(textContent(composeResult)) as { ok?: boolean; sectionCount?: number }
  assert(!composeResult.isError && compose.ok && compose.sectionCount === 3, 'compose_page did not create the page')

  const duplicateResult = await client.callTool({
    name: 'compose_page',
    arguments: { name: 'smoke-e2e', spec: smokeSpec },
  })
  assert(duplicateResult.isError === true, 'Duplicate compose_page did not return an MCP error')

  const updateResult = await client.callTool({
    name: 'update_page',
    arguments: {
      name: 'smoke-e2e',
      ops: [
        { op: 'replaceProps', sectionId: 'opening-hero', props: { eyebrow: 'Updated', title: 'Still valid' } },
        { op: 'moveSection', sectionId: 'moving-message', toIndex: 0 },
      ],
    },
  })
  const update = JSON.parse(textContent(updateResult)) as { ok?: boolean; applied?: number; sectionCount?: number }
  assert(!updateResult.isError && update.ok && update.applied === 2 && update.sectionCount === 3, 'update_page failed')

  const afterUpdate = await readFile(smokePagePath, 'utf8')
  const badUpdateResult = await client.callTool({
    name: 'update_page',
    arguments: {
      name: 'smoke-e2e',
      ops: [
        {
          op: 'addSection',
          section: { id: 'unknown-section', component: 'unknown.component', props: {} },
        },
      ],
    },
  })
  assert(badUpdateResult.isError === true, 'Invalid update_page did not return an MCP error')
  assert((await readFile(smokePagePath, 'utf8')) === afterUpdate, 'Invalid update_page changed the page file')

  const validateByNameResult = await client.callTool({ name: 'validate_page', arguments: { name: 'smoke-e2e' } })
  const validateByName = JSON.parse(textContent(validateByNameResult)) as { ok?: boolean }
  assert(!validateByNameResult.isError && validateByName.ok, 'validate_page rejected the stored page')

  const invalidSpec = { ...smokeSpec, sections: [{ ...smokeSpec.sections[0], component: 'unknown.component' }] }
  const validateBadSpecResult = await client.callTool({ name: 'validate_page', arguments: { spec: invalidSpec } })
  const validateBadSpec = JSON.parse(textContent(validateBadSpecResult)) as { ok?: boolean; errors?: string[] }
  assert(
    validateBadSpecResult.isError === true && !validateBadSpec.ok && (validateBadSpec.errors?.length ?? 0) > 0,
    'validate_page did not return errors for an invalid spec',
  )

  const exportResult = await client.callTool({ name: 'export_page', arguments: { name: 'smoke-e2e' } })
  const exported = JSON.parse(textContent(exportResult)) as { ok?: boolean; source?: string }
  assert(!exportResult.isError && exported.ok && exported.source?.includes('data-theme'), 'export_page failed')
  assert(exported.source?.includes('<FeatureGrid') && exported.source.includes('cards={['), 'export_page did not flatten feature cards')
  const componentTags = [...(exported.source?.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g) ?? [])].map((match) => match[1])
  const registryTags = new Set([
    'Hero',
    'FullBleedVideo',
    'DepthCarousel',
    'Marquee',
    'TestimonialCarousel',
    'SplitVideoScrub',
    'MasonryGrid',
    'QuoteParallax',
    'ScrollScaleCards',
    'StickyCardStack',
    'ProjectStack',
    'ScrollCharacterReveal',
    'GradientHeading',
    'FeatureGrid',
    'FeatureCard',
    'Footer',
    'PricingSection',
  ])
  assert(componentTags.every((tag) => registryTags.has(tag)), 'export_page emitted a tag outside the registry')
  console.log('export_page PASS')

  console.log('SMOKE PASS')
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  try {
    await client.close()
  } finally {
    await Promise.all([rm(smokePagePath, { force: true }), rm(smokeExportPath, { force: true })])
  }
}
