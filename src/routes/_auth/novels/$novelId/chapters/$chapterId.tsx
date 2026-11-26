import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { ChapterEditor } from '~/components/novels/chapter-editor'
import { getChapter } from '~/lib/novels'

export const Route = createFileRoute('/_auth/novels/$novelId/chapters/$chapterId')({
  loader: ({ params }) => getChapter({ data: { novelId: params.novelId, id: params.chapterId } }),
  component: EditChapterPage,
})

function EditChapterPage() {
  const detail = useLoaderData({ from: '/_auth/novels/$novelId' })
  const { chapter } = Route.useLoaderData()

  // 按 id 重建组件，换一章编辑时表单不会留着上一章的内容
  return <ChapterEditor key={chapter.id} detail={detail} chapter={chapter} />
}
