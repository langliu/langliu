import { createFileRoute } from '@tanstack/react-router'

import { getNovel } from '~/lib/novels'

// 阅读入口和章节页共用这里取到的目录
export const Route = createFileRoute('/_auth/read/$novelId')({
  loader: ({ params }) => getNovel({ data: { id: params.novelId } }),
})
