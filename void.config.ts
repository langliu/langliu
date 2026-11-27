import { defineConfig } from 'void/config'

// 原 wrangler.jsonc 的配置迁移到这里：
// - D1 沿用线上同一个库（database_id 不变），迁移目录按 Void 约定为 db/migrations/
// - Worker 名与 D1 沿用原 wrangler.jsonc；环境变量改由 src/env.ts + .env（本地）+ void secret put（生产）管理
export default defineConfig({
  worker: {
    compatibility_date: '2026-09-11',
    compatibility_flags: ['nodejs_compat'],
  },
  cloudflare: {
    name: 'nav',
    // 站点只走 workers.dev 子域，没有自定义路由；这三项原本由面板管理，
    // Void 接管发布前要求显式声明
    workers_dev: true,
    preview_urls: true,
    routes: [],
    d1_databases: [
      {
        binding: 'DB',
        database_name: 'nav',
        database_id: '9a8476e4-417e-41e3-9125-e0bae72f27c6',
        migrations_dir: './db/migrations',
      },
    ],
    // 小说封面的对象存储；代码里经 cloudflare:workers 的 env.COVERS 读取
    r2_buckets: [{ binding: 'COVERS', bucket_name: 'nav-covers' }],
  },
})
