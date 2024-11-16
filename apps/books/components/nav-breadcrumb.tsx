import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Fragment, type ReactNode } from 'react'

export function NavBreadcrumb({
  breadcrumbList = [],
  addonAfter,
}: {
  breadcrumbList: {
    title: string
    href?: string
  }[]
  addonAfter?: ReactNode
}) {
  return (
    <header className='flex h-16 shrink-0 items-center gap-2'>
      <div className='flex flex-1 items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-2 h-4' />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbList.map((breadcrumb, index) => {
              if (breadcrumbList.length - 1 === index) {
                return (
                  <BreadcrumbItem key={breadcrumb.title}>
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                )
              }
              return (
                <Fragment key={breadcrumb.title}>
                  <BreadcrumbItem className='hidden md:block'>
                    <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.title}</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className='hidden md:block' />
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className={'ml-auto px-3'}>{addonAfter}</div>
    </header>
  )
}
