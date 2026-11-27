import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppShell } from '~/components/app-shell'
import { getNavBoard } from '~/lib/nav'
import { listNovels } from '~/lib/novels'

// 导航与小说后台共用这个带二级侧栏的外壳；阅读页（/read）留在 _auth 下保持无侧栏沉浸阅读
export const Route = createFileRoute('/_auth/_app')({
  loader: async () => {
    const [board, novels] = await Promise.all([getNavBoard(), listNovels()])
    return { board, novels }
  },
  component: AppLayout,
})

function AppLayout() {
  const { email } = Route.useRouteContext()
  const { board, novels } = Route.useLoaderData()

  return (
    <AppShell email={email} board={board} novels={novels}>
      <Outlet />
    </AppShell>
  )
}
