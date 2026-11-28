import { Outlet, useLocation } from '@tanstack/react-router'

import { PageHeader } from '~/components/app-shell'
import { formatWords, type NovelSummary } from '~/lib/novel-utils'

export function NovelLayout({ novels }: { novels: NovelSummary[] }) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const current = novels.find(
    (novel) => pathname === `/novels/${novel.id}` || pathname.startsWith(`/novels/${novel.id}/`),
  )

  return (
    <>
      <PageHeader
        title={current?.name ?? '小说'}
        description={
          current
            ? `${current.chapterCount} 章 · ${formatWords(current.wordCount)} 字`
            : `${novels.length} 本小说`
        }
      />
      <Outlet />
    </>
  )
}
