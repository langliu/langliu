import { createFileRoute } from '@tanstack/react-router'
import { NovelLayout } from '~/components/novels/novel-layout'
import { listNovels } from '~/lib/novels'

export const Route = createFileRoute('/_auth/novels')({
  loader: () => listNovels(),
  head: () => ({ meta: [{ title: '小说' }] }),
  component: NovelsLayout,
})

function NovelsLayout() {
  const { email } = Route.useRouteContext()

  return <NovelLayout email={email} novels={Route.useLoaderData()} />
}
