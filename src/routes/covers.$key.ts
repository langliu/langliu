import { createFileRoute } from '@tanstack/react-router'

import { getCoverBucket } from '~/lib/covers'

const notFound = () => new Response('Not Found', { status: 404 })

// 封面对象不可变（key 含 uuid），缓存可以放一年
export const Route = createFileRoute('/covers/$key')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const bucket = getCoverBucket()
        if (!bucket) {
          return notFound()
        }
        // 拒绝路径分隔符，只允许裸 key
        if (!/^[a-z0-9-]+\.(png|jpg|webp|gif)$/i.test(params.key)) {
          return notFound()
        }
        const object = await bucket.get(params.key)
        if (!object) {
          return notFound()
        }
        return new Response(object.body, {
          headers: {
            'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream',
            'cache-control': 'public, max-age=31536000, immutable',
            'x-content-type-options': 'nosniff',
          },
        })
      },
    },
  },
})
