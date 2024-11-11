import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import type { ReactNode } from 'react'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className={'w-full'}>
        <div>
          <SidebarTrigger />
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
