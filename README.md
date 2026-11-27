# langliu

个人站点，单体项目。TanStack Start + Cloudflare Workers + D1 + better-auth，部署用 [Void](https://void.cloud)（`void deploy` 到自己的 Cloudflare 账号），UI 用 shadcn/ui（Base UI）+ Tailwind CSS 4。

| 路由           | 说明                                                                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`            | 个人导航：需登录，深色。分类 / 小分类 / 站点的增删改                                                                                                               |
| `/novels`      | 小说后台：需登录。管理小说、分卷和章节；支持导入 TXT（自动识别「第X章」目录和分卷，GB18030/UTF-8/UTF-16 自动解码，导入前可预览勾选）；封面可上传到 R2 或填图片地址 |
| `/read`        | 阅读页：需登录。目录、上下章、字号、记住阅读进度                                                                                                                   |
| `/plan`        | 影视导航：公开的静态资源目录，浅色                                                                                                                                 |
| `/mcp`         | 导航数据的 MCP 服务，Bearer Token 鉴权                                                                                                                             |
| `/covers/$key` | 上传封面图片的读取出口（R2）                                                                                                                                       |

个人导航和小说共用登录后的侧栏外壳；两个页面之间用整页链接跳转：影视导航带自己的统计脚本，不进入登录态。

```
void.config.ts   Worker 名 / D1（沿用线上库）/ R2 绑定等部署配置
src/
  env.ts         环境变量声明（本地值在根目录 .env，生产用 void secret put）
  routes/        路由（_auth.tsx 是登录守卫布局；icon.ts 代取影视导航的站点图标）
  components/
    ui/          shadcn/ui 组件
    nav/ plan/ novels/   各页面的业务组件
    app-shell.tsx        登录后共用的侧栏外壳
  lib/           鉴权、数据库、导航读写、小说读写、TXT 切分、R2 封面、MCP、统计
  data/plan.ts   影视导航的数据
db/migrations/   D1 迁移（Void 约定目录）
```

## 本地

```bash
# 在根目录创建 .env，键名见 src/env.ts（BETTER_AUTH_SECRET / BETTER_AUTH_URL / MCP_TOKEN）
pnpm install
pnpm dev
```

打开 http://localhost:3000 ，首次进入登录页可创建第一个账号。本地 D1/R2 状态存放在 `.void/`（不进 Git）。

其余脚本：`pnpm typecheck`、`pnpm lint`、`pnpm check`、`pnpm build`、`pnpm cf-typegen`（= `void prepare`，改了 `void.config.ts` 或 `src/env.ts` 后重跑）。

## 远程资源与部署

D1 库和 R2 桶沿用已开通的资源（`void.config.ts` 里声明了 ID / 名称，`void.lock.json` 记录状态）：

```bash
pnpm deploy             # = void deploy --platform cloudflare
```

部署前 Void 会检查 `db/migrations/` 是否有未应用的迁移（就是 wrangler 的 `d1_migrations` 日志，两边通用），`void deploy` 需要每个必填 env 键在远端已有 secret：

```bash
pnpm exec void secret put BETTER_AUTH_SECRET
pnpm exec void secret put MCP_TOKEN
```

回滚：`pnpm exec void project rollback`（或 `wrangler rollback --name nav`）。

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

本地开发时 Token 读根目录 `.env` 里的 `MCP_TOKEN`。

## 影视导航的统计（可选）

设置 `GOOGLE_ANALYTICS_ID` / `GOOGLE_TAG_MANAGER_ID` 后，`/plan` 会注入 gtag.js 与 GTM，卡片点击会上报 `link_click` 事件。不设置就不加载任何第三方脚本；个人导航页始终不加载。

```bash
pnpm exec void secret put GOOGLE_ANALYTICS_ID
pnpm exec void secret put GOOGLE_TAG_MANAGER_ID
```

本地开发时写进根目录 `.env`。

## 新增 shadcn 组件

```bash
pnpm dlx shadcn@latest add dialog
```
