import { Baby, Cloud, Compass, Database, MapIcon, Tv } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'

const items = [
  {
    title: '在线视频',
    url: '#online',
    icon: Tv,
  },
  {
    title: '影视数据库',
    url: '#database',
    icon: Database,
  },
  {
    title: '云盘资源',
    url: '#cloud',
    icon: Cloud,
  },
  {
    title: 'Korean BJ',
    url: '#korean',
    icon: Baby,
  },
]

export function PlanSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' render={<a href='/plan' />}>
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <MapIcon className='size-4' />
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <h1 className='truncate font-semibold'>影视导航</h1>
                <span className='truncate text-xs'>Video Navigation</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* 整页跳转：个人导航是另一个（需登录的）功能，不与公开的影视导航共享页面会话 */}
            <SidebarMenuButton render={<a href='/' />}>
              <Compass />
              <span>个人导航</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
