import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { createFileRoute } from '@tanstack/react-router'
import { env } from 'void/env'
import { createNavMcpServer } from '~/lib/mcp'

function jsonRpcResponse(
  status: number,
  body: { jsonrpc: '2.0'; error: { code: number; message: string }; id: null },
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

function methodNotAllowed() {
  return new Response('Method Not Allowed', { status: 405, headers: { allow: 'POST' } })
}

export const Route = createFileRoute('/mcp')({
  server: {
    handlers: {
      GET: methodNotAllowed,
      DELETE: methodNotAllowed,
      POST: async ({ request }) => {
        const token = env.MCP_TOKEN
        const authorization = request.headers.get('authorization')
        if (!token || authorization !== `Bearer ${token}`) {
          return jsonRpcResponse(401, {
            jsonrpc: '2.0',
            error: { code: -32001, message: 'Unauthorized' },
            id: null,
          })
        }

        try {
          // 无状态模式：每个请求用独立的 server/transport，不保留会话。
          const server = createNavMcpServer()
          const transport = new WebStandardStreamableHTTPServerTransport({
            sessionIdGenerator: undefined,
          })
          await server.connect(transport)
          return await transport.handleRequest(request)
        } catch (error) {
          console.error('MCP request failed', error)
          return jsonRpcResponse(500, {
            jsonrpc: '2.0',
            error: { code: -32603, message: 'Internal error' },
            id: null,
          })
        }
      },
    },
  },
})
