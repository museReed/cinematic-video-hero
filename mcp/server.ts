import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod/v3'
import { getComponentSchema } from './tools/getComponentSchema'
import { listDesignTokens } from './tools/listDesignTokens'
import { searchComponents } from './tools/searchComponents'

const server = new McpServer({ name: 'component-library-spike', version: '1.0.0' })

server.registerTool(
  'searchComponents',
  {
    description: 'Search component ids and descriptions, optionally filtering by component group.',
    inputSchema: z.object({ query: z.string().optional(), group: z.string().optional() }).strict(),
    annotations: { readOnlyHint: true },
  },
  async (input) => ({ content: [{ type: 'text', text: JSON.stringify(searchComponents(input), null, 2) }] }),
)

server.registerTool(
  'getComponentSchema',
  {
    description: 'Get one component JSON Schema, allowed children, and examples.',
    inputSchema: z.object({ componentId: z.string() }).strict(),
    annotations: { readOnlyHint: true },
  },
  async (input) => {
    const result = getComponentSchema(input)
    return {
      content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
      isError: !result.ok,
    }
  },
)

server.registerTool(
  'listDesignTokens',
  {
    description: 'List the spike theme tokens and media allowlists.',
    inputSchema: z.object({}).strict(),
    annotations: { readOnlyHint: true },
  },
  async () => ({ content: [{ type: 'text', text: JSON.stringify(listDesignTokens(), null, 2) }] }),
)

await server.connect(new StdioServerTransport())
