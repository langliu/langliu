'use client'

import { MoreHorizontal, Plus } from 'lucide-react'
import * as React from 'react'

import { EditSheet } from '@/app/dashboard/books/[id]/edit-sheet'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavActions({ bookId, chapters = 0 }: { bookId: string; chapters: number }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const currentDate = new Intl.DateTimeFormat('zh', {
    dateStyle: 'full',
  }).format(new Date())

  return (
    <div className='flex items-center gap-2 text-sm'>
      <div className='hidden font-medium text-muted-foreground md:inline-block'>{currentDate}</div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant='ghost' size='icon' className='h-7 w-7 data-[state=open]:bg-accent'>
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-56 overflow-hidden rounded-lg p-0' align='end'>
          <Sidebar collapsible='none' className='bg-transparent'>
            <SidebarContent>
              <SidebarGroup className='border-b last:border-none'>
                <SidebarGroupContent className='gap-0'>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <EditSheet
                        bookId={bookId}
                        type={'create'}
                        last={chapters + 1}
                        customTrigger={
                          <SidebarMenuButton>
                            <Plus /> <span>新建文章</span>
                          </SidebarMenuButton>
                        }
                      />
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  )
}
