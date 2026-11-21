# nav

个人导航站。TanStack Start + Cloudflare Workers + D1 + better-auth。

## 本地

```bash
cp apps/nav/.dev.vars.example apps/nav/.dev.vars
pnpm install
pnpm --filter nav cf-typegen
pnpm --filter nav db:migrate:local
pnpm --filter nav dev
```

打开 http://localhost:3001 ，首次进入登录页可创建第一个账号。

## 远程 D1

```bash
pnpm --filter nav exec wrangler d1 create nav
# 把返回的 database_id 写入 wrangler.jsonc
pnpm --filter nav exec wrangler d1 migrations apply DB --remote
pnpm --filter nav exec wrangler secret put BETTER_AUTH_SECRET
```

## MCP

`/mcp` 提供无状态 Streamable HTTP 的 MCP 服务，用 Bearer Token 鉴权（对应 secret `MCP_TOKEN`）：

```bash
pnpm --filter nav exec wrangler secret put MCP_TOKEN
pnpm --filter nav deploy
```

可用工具：`list_categories`、`search_links`、`list_links`、`create_link`。

MCP 客户端配置（例如 Claude Code / Cursor）：

```json
{
  "mcpServers": {
    "nav": {
      "type": "http",
      "url": "https://nav.langliu1216.workers.dev/mcp",
      "headers": { "Authorization": "Bearer <MCP_TOKEN>" }
    }
  }
}
```

本地开发时 Token 读 `apps/nav/.dev.vars` 里的 `MCP_TOKEN`。
