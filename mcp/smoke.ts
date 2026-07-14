import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

function hasContent(result: Awaited<ReturnType<Client['callTool']>>) {
  return Array.isArray(result.content) && result.content.length > 0
}

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ['--import', 'tsx', 'mcp/server.ts'],
  cwd: process.cwd(),
  stderr: 'pipe',
})
const client = new Client({ name: 'component-library-smoke', version: '1.0.0' })

try {
  await client.connect(transport)
  const listed = await client.listTools()
  assert(listed.tools.length === 3, `Expected 3 tools, received ${listed.tools.length}`)

  const searchResult = await client.callTool({ name: 'searchComponents', arguments: { query: 'hero' } })
  assert(hasContent(searchResult), 'searchComponents returned no content')

  const schemaResult = await client.callTool({ name: 'getComponentSchema', arguments: { componentId: 'cinematic.hero-reveal' } })
  assert(hasContent(schemaResult) && !schemaResult.isError, 'getComponentSchema returned an error or no content')

  const tokenResult = await client.callTool({ name: 'listDesignTokens', arguments: {} })
  assert(hasContent(tokenResult), 'listDesignTokens returned no content')

  const unknownResult = await client.callTool({ name: 'getComponentSchema', arguments: { componentId: 'unknown.component' } })
  assert(unknownResult.isError === true, 'Unknown componentId did not return an MCP error')

  console.log('SMOKE PASS')
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await client.close()
}
