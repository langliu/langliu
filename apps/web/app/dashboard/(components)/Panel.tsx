'use client'
import { useState } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/libs/utils'
import SideNav from '@/ui/dashboard/sidenav'

type CookieStoreApi = {
  set(options: { name: string; value: string; path: string }): Promise<void>
}

function savePanelCookie(name: string, value: unknown) {
  const serializedValue = JSON.stringify(value)
  const cookieStore = (window as typeof window & { cookieStore?: CookieStoreApi }).cookieStore

  if (cookieStore) {
    void cookieStore.set({ name, value: serializedValue, path: '/dashboard' })
    return
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Required as a fallback for browsers without the Cookie Store API.
  document.cookie = `${name}=${serializedValue}; Path=/dashboard; SameSite=Lax`
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const defaultLayout = [15, 85]

  return (
    <TooltipProvider delayDuration={0}>
      <div className='flex h-screen flex-col md:flex-row md:overflow-hidden'>
        <ResizablePanelGroup
          direction='horizontal'
          onLayout={(sizes: number[]) => {
            savePanelCookie('react-resizable-panels:layout', sizes)
          }}
          className='h-full items-stretch'
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsible={true}
            minSize={10}
            maxSize={20}
            onCollapse={() => {
              setIsCollapsed(true)
              savePanelCookie('react-resizable-panels:collapsed', true)
            }}
            onExpand={() => {
              setIsCollapsed(false)
              savePanelCookie('react-resizable-panels:collapsed', false)
            }}
            className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
          >
            <div
              className={cn(
                'flex h-[52px] items-center justify-center',
                isCollapsed ? 'h-[52px]' : 'px-2',
              )}
            >
              <div className='cursor-pointer font-semibold text-black text-xl'>
                研{isCollapsed ? '' : '之有物'}
              </div>
            </div>
            <Separator />
            <SideNav isCollapsed={isCollapsed} />
            <Separator />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TooltipProvider>
  )
}
