import { Link, Outlet, useLocation } from '@tanstack/react-router'
import { BookOpen, Library } from 'lucide-react'
import { AppShell } from '~/components/app-shell'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import { formatWords, type NovelSummary } from '~/lib/novel-utils'

export function NovelLayout({ email, novels }: { email: string; novels: NovelSummary[] }) {
  const pathname = useLocation({ select: (location) => location.pathname })
  const current = novels.find(
    (novel) => pathname === `/novels/${novel.id}` || pathname.startsWith(`/novels/${novel.id}/`),
  )

  return (
    <AppShell
      email={email}
      groups={
        <SidebarGroup>
          <SidebarGroupLabel>小说</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to='/novels' />}
                  isActive={pathname === '/novels'}
                  tooltip='全部小说'
                >
                  <Library />
                  <span>全部小说</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {novels.map((novel) => (
                <SidebarMenuItem key={novel.id}>
                  <SidebarMenuButton
                    render={<Link to='/novels/$novelId' params={{ novelId: novel.id }} />}
                    isActive={current?.id === novel.id}
                    tooltip={novel.name}
                  >
                    <BookOpen />
                    <span className='truncate'>{novel.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      }
      title={current?.name ?? '小说'}
      description={
        current
          ? `${current.chapterCount} 章 · ${formatWords(current.wordCount)} 字`
          : `${novels.length} 本小说`
      }
    >
      <Outlet />
    </AppShell>
  )
}
