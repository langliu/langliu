import { Link, useLocation, useRouter } from '@tanstack/react-router'
import { BookOpen, Clapperboard, Compass, LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { Separator } from '~/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { authClient } from '~/lib/auth-client'

/** 登录后各页面共用的侧栏外壳：logo、应用入口和登出都在这里，页面只管自己的分组和内容。 */
export function AppShell({
  email,
  groups,
  headerAction,
  title,
  description,
  actions,
  children,
}: {
  email: string
  /** 页面自己的侧栏分组 */
  groups?: ReactNode
  /** 侧栏 logo 下方的操作按钮 */
  headerAction?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** 顶栏右侧的操作 */
  actions?: ReactNode
  children: ReactNode
}) {
  const router = useRouter()
  const onNovels = useLocation({ select: ({ pathname }) => pathname.startsWith('/novels') })

  async function signOut() {
    await authClient.signOut()
    await router.navigate({ to: '/login' })
  }

  return (
    <SidebarProvider>
      <Sidebar variant='inset' collapsible='icon'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' render={<Link to='/' />}>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                  <Compass className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>导航</span>
                  <span className='truncate text-xs'>个人书签</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {headerAction}
        </SidebarHeader>
        <SidebarContent>
          {groups}
          <SidebarGroup>
            <SidebarGroupLabel>应用</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* 小说区自己的侧栏里已经有“全部小说”，不用再列一遍 */}
                {onNovels ? null : (
                  <SidebarMenuItem>
                    <SidebarMenuButton render={<Link to='/novels' />} tooltip='小说'>
                      <BookOpen />
                      <span>小说</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  {/* 整页跳转：影视导航是公开页面，带着自己的统计脚本，不进入导航的登录态 */}
                  <SidebarMenuButton render={<a href='/plan' />} tooltip='影视导航'>
                    <Clapperboard />
                    <span>影视导航</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut} tooltip='登出'>
                <LogOut />
                <span className='truncate'>{email}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className='sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur'>
          <div className='flex min-w-0 items-center gap-2'>
            <SidebarTrigger />
            <Separator orientation='vertical' className='h-4' />
            <div className='min-w-0'>
              <h1 className='font-medium text-sm'>{title}</h1>
              {description ? <p className='text-muted-foreground text-xs'>{description}</p> : null}
            </div>
          </div>
          {actions}
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
