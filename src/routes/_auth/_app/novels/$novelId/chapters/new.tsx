import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { z } from 'zod'

import { ChapterEditor } from '~/components/novels/chapter-editor'

export const Route = createFileRoute('/_auth/_app/novels/$novelId/chapters/new')({
  // 从某一卷的“章节”按钮进来时带上 volumeId，新建的章节直接归到这一卷
  validateSearch: z.object({ volumeId: z.string().optional() }),
  component: NewChapterPage,
})

function NewChapterPage() {
  const detail = useLoaderData({ from: '/_auth/_app/novels/$novelId' })
  const { volumeId } = Route.useSearch()

  return <ChapterEditor key='new' detail={detail} chapter={null} initialVolumeId={volumeId} />
}
