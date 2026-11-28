import { createFileRoute, useLoaderData } from '@tanstack/react-router'
import { z } from 'zod'

import { NavBoard } from '~/components/nav/nav-board'

export const Route = createFileRoute('/_auth/_app/')({
  validateSearch: z.object({
    cat: z.string().optional(),
  }),
  component: NavPage,
})

function NavPage() {
  const { board } = useLoaderData({ from: '/_auth/_app' })
  const { cat } = Route.useSearch()

  return <NavBoard board={board} activeCat={cat} />
}
