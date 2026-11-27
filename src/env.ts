import { defineEnv, string, url } from 'void/env'

// 本地值写在根目录 .env；生产用 void secret put（值已在 Cloudflare 上，部署时会校验存在性）
export default defineEnv({
  // better-auth 的签名密钥与站点地址；地址走代码默认，本地用 .env 覆盖成 localhost
  BETTER_AUTH_SECRET: string(),
  BETTER_AUTH_URL: url().default('https://nav.langliu1216.workers.dev'),
  // MCP 服务的 Bearer Token
  MCP_TOKEN: string(),
  // 影视导航的统计脚本，不配置就不注入
  GOOGLE_ANALYTICS_ID: string().optional(),
  GOOGLE_TAG_MANAGER_ID: string().optional(),
})
