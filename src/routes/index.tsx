import { createFileRoute, redirect } from '@tanstack/react-router'
import { NavBoard } from '~/components/nav/nav-board'
import { getNavBoard } from '~/lib/nav'
import { getSession } from '~/lib/session'

export const Route = createFileRoute('/')({
  loader: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: '/login' })
    }
    const board = await getNavBoard()
    return { board, email: session.user.email }
  },
  component: NavPage,
})

function NavPage() {
  const { board, email } = Route.useLoaderData()
  return <NavBoard board={board} email={email} />
}
