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
