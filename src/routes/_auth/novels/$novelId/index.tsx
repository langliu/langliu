import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { NovelManage } from '~/components/novels/novel-manage'

export const Route = createFileRoute('/_auth/novels/$novelId/')({
  component: ManagePage,
})

function ManagePage() {
  const detail = useLoaderData({ from: '/_auth/novels/$novelId' })

  return <NovelManage detail={detail} />
}
