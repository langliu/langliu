import { createFileRoute, useLoaderData } from '@tanstack/react-router'

import { NovelList } from '~/components/novels/novel-list'

export const Route = createFileRoute('/_auth/_app/novels/')({
  component: ListPage,
})

function ListPage() {
  // 书架列表由外层布局取好，这里直接用
  const { novels } = useLoaderData({ from: '/_auth/_app' })

  return <NovelList novels={novels} />
}
