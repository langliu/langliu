import { createFileRoute } from '@tanstack/react-router'

import { plan } from '~/data/plan'

// 只代取影视导航数据里声明过的图标地址，避免变成任意 URL 的开放代理
const iconUrls = new Set(
  plan.flatMap((section) => section.data.map((item) => item.icon ?? `${item.link}favicon.ico`)),
)

// 只放行位图：SVG 可以带脚本，HTML 更不能从本站同源返回
const imageTypes = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/avif',
  'image/bmp',
  'image/x-icon',
  'image/vnd.microsoft.icon',
])

const notFound = () => new Response('Not Found', { status: 404 })
const badGateway = () =>
  new Response('Bad Gateway', {
    status: 502,
    headers: { 'cache-control': 'public, max-age=60' },
  })

export const Route = createFileRoute('/icon')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const src = new URL(request.url).searchParams.get('src')
        if (!src || !iconUrls.has(src)) {
          return notFound()
        }

        try {
          const upstream = await fetch(src, { signal: AbortSignal.timeout(5000) })
          const type = upstream.headers.get('content-type')?.split(';')[0].trim().toLowerCase()
          if (!upstream.ok || !type || !imageTypes.has(type)) {
            throw new Error(`unexpected icon response: ${upstream.status} ${type ?? ''}`)
          }
          const body = await upstream.arrayBuffer()
          if (body.byteLength > 256 * 1024) {
            throw new Error(`icon too large: ${body.byteLength} bytes`)
          }
          return new Response(body, {
            headers: {
              'content-type': type,
              'cache-control': 'public, max-age=604800',
              'x-content-type-options': 'nosniff',
            },
          })
        } catch (error) {
          console.warn('Icon proxy failed', src, error)
          return badGateway()
        }
      },
    },
  },
})
