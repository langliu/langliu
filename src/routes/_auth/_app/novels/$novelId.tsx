import { createFileRoute } from '@tanstack/react-router'

import { getNovel } from '~/lib/novels'

// 详情、章节编辑都挂在下面，共用这里取到的小说信息
export const Route = createFileRoute('/_auth/_app/novels/$novelId')({
  loader: ({ params }) => getNovel({ data: { id: params.novelId } }),
  head: ({ loaderData }) => ({ meta: [{ title: loaderData?.name ?? '小说' }] }),
})
