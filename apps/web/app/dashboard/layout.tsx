'use client'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/libs/utils'
import SideNav from '@/ui/dashboard/sidenav'
import { useState } from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const defaultLayout = [15, 85]
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout[0]}
            collapsible={true}
            minSize={10}
            maxSize={20}
            onCollapse={() => {
              setIsCollapsed(true)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`
            }}
            onExpand={() => {
              setIsCollapsed(false)
              document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`
            }}
            className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
          >
            <div
              className={cn(
                'flex h-[52px] items-center justify-center',
                isCollapsed ? 'h-[52px]' : 'px-2',
              )}
            >
              <div className="text-black text-xl font-semibold cursor-pointer">
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
