import { Link, useLocation, useRouter } from '@tanstack/react-router'
import {
  BookOpen,
  Clapperboard,
  Command,
  Compass,
  Folder,
  LayoutGrid,
  Library,
  LogIn,
  LogOut,
  MapIcon,
} from 'lucide-react'
import { type ComponentProps, type CSSProperties, type ReactNode, useEffect, useState } from 'react'
import { Separator } from '~/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '~/components/ui/sidebar'
import { TooltipProvider } from '~/components/ui/tooltip'
import { planNavItems } from '~/data/plan-nav'
import { authClient } from '~/lib/auth-client'
import type { NavCategory } from '~/lib/nav'
import type { NovelSummary } from '~/lib/novel-utils'

type AppKey = 'nav' | 'novels' | 'plan'

const APP_ITEMS = [
  { key: 'nav' as const, label: '导航', icon: Compass, authOnly: true },
  { key: 'novels' as const, label: '小说', icon: BookOpen, authOnly: true },
  { key: 'plan' as const, label: '影视导航', icon: Clapperboard, authOnly: false },
] as const

const DUAL_SIDEBAR_STYLE = { '--sidebar-width': '18rem' } as CSSProperties

function countLinks(cat: NavCategory) {
  return cat.subcategories.reduce((total, sub) => total + sub.links.length, 0)
}

/** 用于 Base UI `render` 属性的原生整页链接，children 由外层 SidebarMenuButton 注入。 */
function FullPageLink({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>
}

/** 各应用共用的双栏侧栏外壳：最左侧为纯图标一级应用栏，右侧紧邻当前应用的二级菜单。 */
export function AppShell({
  email,
  board = [],
  novels = [],
  children,
}: {
  /** 未登录访问公开页（如 /plan）时为 null */
  email: string | null
  board?: NavCategory[]
  novels?: NovelSummary[]
  children: ReactNode
}) {
  return (
    <TooltipProvider delay={150}>
      <SidebarProvider style={DUAL_SIDEBAR_STYLE}>
        <AppSidebar email={email} board={board} novels={novels} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

/** 主内容区顶栏：保留侧栏折叠按钮、标题、副标题和右侧操作区。 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className='bg-background/80 sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b px-4 backdrop-blur'>
      <div className='flex min-w-0 items-center gap-2'>
        <SidebarTrigger />
        <Separator orientation='vertical' className='h-4' />
        <div className='min-w-0'>
          <h1 className='truncate text-sm font-medium'>{title}</h1>
          {description ? (
            <p className='text-muted-foreground truncate text-xs'>{description}</p>
          ) : null}
        </div>
      </div>
      {actions}
    </header>
  )
}

function AppSidebar({
  email,
  board,
  novels,
}: {
  email: string | null
  board: NavCategory[]
  novels: NovelSummary[]
}) {
  const router = useRouter()
  const { isMobile, setOpen, setOpenMobile } = useSidebar()
  const { pathname, searchStr, hash } = useLocation({
    select: (location) => ({
      pathname: location.pathname,
      searchStr: location.searchStr,
      hash: location.hash,
    }),
  })

  const onPlan = pathname.startsWith('/plan')
  const routeApp: AppKey = pathname.startsWith('/novels') ? 'novels' : onPlan ? 'plan' : 'nav'
  const [selectedApp, setSelectedApp] = useState<AppKey>(routeApp)

  // 路由切换（如浏览器前进/后退或站内跳转）时，一级栏同步到当前应用
  useEffect(() => {
    setSelectedApp(routeApp)
  }, [routeApp])

  const visibleApps = email ? APP_ITEMS : APP_ITEMS.filter((item) => !item.authOnly)
  const rawCat = new URLSearchParams(searchStr).get('cat')
  const activeCat = rawCat && board.some((cat) => cat.id === rawCat) ? rawCat : null
  const activeHash = hash.replace(/^#/, '')
  const totalLinks = board.reduce((total, cat) => total + countLinks(cat), 0)

  const closeMobile = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  function selectApp(app: AppKey) {
    setSelectedApp(app)
    if (!isMobile) {
      setOpen(true)
    }
  }

  async function signOut() {
    await authClient.signOut()
    await router.navigate({ to: '/login' })
  }

  const activeMeta = APP_ITEMS.find((item) => item.key === selectedApp) ?? APP_ITEMS[0]

  // 跨过 /plan 边界时走整页跳转：影视导航带有可选统计脚本，不与个人导航/小说共享页面上下文
  const renderNavLink = (catId?: string) =>
    onPlan ? (
      <FullPageLink
        href={catId ? `/?cat=${encodeURIComponent(catId)}` : '/'}
        onClick={closeMobile}
      />
    ) : (
      <Link to='/' search={catId ? { cat: catId } : {}} onClick={closeMobile} />
    )

  const renderNovelsLink = (novelId?: string) =>
    onPlan ? (
      <FullPageLink href={novelId ? `/novels/${novelId}` : '/novels'} onClick={closeMobile} />
    ) : novelId ? (
      <Link to='/novels/$novelId' params={{ novelId }} onClick={closeMobile} />
    ) : (
      <Link to='/novels' onClick={closeMobile} />
    )

  return (
    <Sidebar variant='inset' collapsible='icon' className='overflow-hidden'>
      <div className='flex size-full flex-row overflow-hidden'>
        {/* 一级菜单：最左侧独立的纯图标栏 */}
        <Sidebar
          collapsible='none'
          className='border-sidebar-border w-[calc(var(--sidebar-width-icon)+1px)]! shrink-0 border-r group-data-[collapsible=icon]:border-r-0'
        >
          <SidebarHeader className='items-center p-2'>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size='lg'
                  className='size-8! justify-center p-0!'
                  tooltip={{ children: 'langliu', hidden: isMobile }}
                  render={
                    email ? (
                      onPlan ? (
                        <FullPageLink href='/' onClick={closeMobile} />
                      ) : (
                        <Link
                          to='/'
                          search={{}}
                          onClick={() => {
                            setSelectedApp('nav')
                            closeMobile()
                          }}
                        />
                      )
                    ) : (
                      <FullPageLink href='/plan' onClick={closeMobile} />
                    )
                  }
                >
                  <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                    <Command className='size-4' />
                  </div>
                  <span className='sr-only'>langliu</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup className='p-2'>
              <SidebarGroupContent>
                <SidebarMenu className='gap-1.5'>
                  {visibleApps.map((app) => (
                    <SidebarMenuItem key={app.key}>
                      <SidebarMenuButton
                        isActive={selectedApp === app.key}
                        onClick={() => selectApp(app.key)}
                        className='size-8 justify-center p-0'
                        tooltip={{ children: app.label, hidden: isMobile }}
                      >
                        <app.icon />
                        <span className='sr-only'>{app.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className='items-center p-2'>
            <SidebarMenu>
              <SidebarMenuItem>
                {email ? (
                  <SidebarMenuButton
                    onClick={signOut}
                    className='size-8 justify-center p-0'
                    tooltip={{ children: `登出（${email}）`, hidden: isMobile }}
                  >
                    <LogOut />
                    <span className='sr-only'>登出</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    render={<FullPageLink href='/login' />}
                    className='size-8 justify-center p-0'
                    tooltip={{ children: '登录', hidden: isMobile }}
                  >
                    <LogIn />
                    <span className='sr-only'>登录</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* 二级菜单：展示当前选中应用的子菜单 */}
        <Sidebar
          collapsible='none'
          className='w-auto min-w-0 flex-1 group-data-[collapsible=icon]:hidden'
        >
          <SidebarHeader className='border-sidebar-border h-12 flex-row items-center justify-between border-b px-3.5 py-0'>
            <span className='text-foreground truncate text-sm font-semibold'>
              {activeMeta.label}
            </span>
            <span className='text-muted-foreground text-xs tabular-nums'>
              {selectedApp === 'nav'
                ? `${totalLinks} 个站点`
                : selectedApp === 'novels'
                  ? `${novels.length} 本`
                  : `${planNavItems.length} 个分类`}
            </span>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className='gap-0.5'>
                  {selectedApp === 'nav' ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          render={renderNavLink()}
                          isActive={pathname === '/' && !activeCat}
                        >
                          <LayoutGrid />
                          <span>全部</span>
                          <SidebarMenuBadge>{totalLinks}</SidebarMenuBadge>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {board.map((cat) => (
                        <SidebarMenuItem key={cat.id}>
                          <SidebarMenuButton
                            render={renderNavLink(cat.id)}
                            isActive={pathname === '/' && activeCat === cat.id}
                          >
                            <Folder />
                            <span>{cat.name}</span>
                            <SidebarMenuBadge>{countLinks(cat)}</SidebarMenuBadge>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  ) : null}

                  {selectedApp === 'novels' ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          render={renderNovelsLink()}
                          isActive={pathname === '/novels'}
                        >
                          <Library />
                          <span>全部小说</span>
                          <SidebarMenuBadge>{novels.length}</SidebarMenuBadge>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {novels.map((novel) => (
                        <SidebarMenuItem key={novel.id}>
                          <SidebarMenuButton
                            render={renderNovelsLink(novel.id)}
                            isActive={
                              pathname === `/novels/${novel.id}` ||
                              pathname.startsWith(`/novels/${novel.id}/`)
                            }
                          >
                            <BookOpen />
                            <span className='truncate'>{novel.name}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  ) : null}

                  {selectedApp === 'plan' ? (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          render={
                            <FullPageLink href={onPlan ? '#top' : '/plan'} onClick={closeMobile} />
                          }
                          isActive={onPlan && (!activeHash || activeHash === 'top')}
                        >
                          <MapIcon />
                          <span>全部影视</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      {planNavItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            render={
                              <FullPageLink
                                href={onPlan ? `#${item.id}` : `/plan#${item.id}`}
                                onClick={closeMobile}
                              />
                            }
                            isActive={onPlan && activeHash === item.id}
                          >
                            <item.icon />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </>
                  ) : null}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </div>
    </Sidebar>
  )
}
