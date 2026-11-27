import { createFileRoute, useLoaderData } from '@tanstack/react-router'

import { NovelManage } from '~/components/novels/novel-manage'

export const Route = createFileRoute('/_auth/_app/novels/$novelId/')({
  component: ManagePage,
})

function ManagePage() {
  const detail = useLoaderData({ from: '/_auth/_app/novels/$novelId' })

  return <NovelManage detail={detail} />
}
