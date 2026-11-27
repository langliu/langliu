import { createFileRoute, useLoaderData } from '@tanstack/react-router'

import { NovelLayout } from '~/components/novels/novel-layout'

export const Route = createFileRoute('/_auth/_app/novels')({
  head: () => ({ meta: [{ title: '小说' }] }),
  component: NovelsLayout,
})

function NovelsLayout() {
  const { novels } = useLoaderData({ from: '/_auth/_app' })

  return <NovelLayout novels={novels} />
}
