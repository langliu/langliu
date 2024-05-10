import { buttonVariants } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/libs/utils'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import NavLinks from './nav-links'

import { Separator } from '@/components/ui/separator'

export default function SideNav({ isCollapsed = false }: { isCollapsed?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex grow flex-col justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks isCollapsed={isCollapsed} />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
        <Separator />
        <div
          data-collapsed={isCollapsed}
          className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >
          <nav className="grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
            {isCollapsed ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={'#'}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-9 w-9')}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">退出登录</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  退出登录
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                href={'#'}
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),

                  'justify-start',
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                退出登录
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
