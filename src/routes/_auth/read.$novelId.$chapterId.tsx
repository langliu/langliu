import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { Reader } from '~/components/novels/reader'
import { getChapter } from '~/lib/novels'

export const Route = createFileRoute('/_auth/read/$novelId/$chapterId')({
  loader: ({ params }) => getChapter({ data: { novelId: params.novelId, id: params.chapterId } }),
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.chapter.title} · ${loaderData.novelName}` }] : [],
  }),
  component: ReaderPage,
})

function ReaderPage() {
  const detail = useLoaderData({ from: '/_auth/read/$novelId' })
  const chapter = Route.useLoaderData()

  return <Reader detail={detail} chapter={chapter} />
}
