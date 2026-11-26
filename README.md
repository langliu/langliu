# langliu

个人站点，单体项目。TanStack Start + Cloudflare Workers + D1 + better-auth，UI 用 shadcn/ui（Base UI）+ Tailwind CSS 4。

| 路由 | 说明 |
| --- | --- |
| `/` | 个人导航：需登录，深色。分类 / 小分类 / 站点的增删改 |
| `/novels` | 小说后台：需登录。管理小说（封面、名称、状态）、分卷和章节 |
| `/read` | 阅读页：需登录。目录、上下章、字号、记住阅读进度 |
| `/plan` | 影视导航：公开的静态资源目录，浅色 |
| `/mcp` | 导航数据的 MCP 服务，Bearer Token 鉴权 |

个人导航和小说共用登录后的侧栏外壳；两个页面之间用整页链接跳转：影视导航带自己的统计脚本，不进入登录态。

```
src/
  routes/        路由（_auth.tsx 是登录守卫布局；icon.ts 代取影视导航的站点图标）
  components/
    ui/          shadcn/ui 组件
    nav/ plan/ novels/   各页面的业务组件
    app-shell.tsx        登录后共用的侧栏外壳
  lib/           鉴权、数据库、导航读写、小说读写、MCP、统计
  data/plan.ts   影视导航的数据
  styles/        Tailwind 与主题变量
migrations/      D1 迁移
```

## 本地

```bash
cp .dev.vars.example .dev.vars
pnpm install
pnpm cf-typegen
pnpm db:migrate:local
pnpm dev
```

打开 http://localhost:3000 ，首次进入登录页可创建第一个账号。

其余脚本：`pnpm typecheck`、`pnpm lint`、`pnpm check`、`pnpm build`、`pnpm preview`。

`wrangler types` 会把 `.dev.vars` 里的变量一并写进类型，改了 `.dev.vars` 或 `wrangler.jsonc` 后重跑 `pnpm cf-typegen`。

## 远程 D1

```bash
pnpm exec wrangler d1 create nav
# 把返回的 database_id 写入 wrangler.jsonc
pnpm db:migrate:remote
pnpm exec wrangler secret put BETTER_AUTH_SECRET
pnpm exec wrangler secret put MCP_TOKEN
```

## 部署

```bash
pnpm deploy
```

## MCP

`/mcp` 提供无状态 Streamable HTTP 的 MCP 服务，用 Bearer Token 鉴权（对应 secret `MCP_TOKEN`）。

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

本地开发时 Token 读 `.dev.vars` 里的 `MCP_TOKEN`。

## 影视导航的统计（可选）

设置 `GOOGLE_ANALYTICS_ID` / `GOOGLE_TAG_MANAGER_ID` 后，`/plan` 会注入 gtag.js 与 GTM，卡片点击会上报 `link_click` 事件。不设置就不加载任何第三方脚本；个人导航页始终不加载。

```bash
pnpm exec wrangler secret put GOOGLE_ANALYTICS_ID
pnpm exec wrangler secret put GOOGLE_TAG_MANAGER_ID
```

本地开发时写进 `.dev.vars`。

## 新增 shadcn 组件

```bash
pnpm dlx shadcn@latest add dialog
```
