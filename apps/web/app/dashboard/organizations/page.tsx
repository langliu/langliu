import { buttonVariants } from '@langliu/ui/ui/button'
import { ScrollArea } from '@langliu/ui/ui/scroll-area'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import { InvoicesTableSkeleton } from './Skeletons'
import Table from './Table'

export function CreateInvoice() {
  return (
    <Link
      href='/dashboard/organizations/create'
      className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'ml-auto gap-1.5',
      })}
    >
      <Plus className='size-3.5' />
      <span>新建机构</span>
    </Link>
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams?.query || ''
  const currentPage = Number(resolvedSearchParams?.page) || 1
  // const totalPages = await fetchInvoicesPages(query)

  return (
    <div className='flex h-screen flex-col'>
      <DashboardHeader title='机构管理' extra={<CreateInvoice />} />
      <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4'>
        <div className='flex gap-4'>
          <Search placeholder='请输入机构名称' />
        </div>
        <ScrollArea className='relative h-screen flex-1 rounded-md border'>
          <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
            <Table query={query} currentPage={currentPage} />
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  )
}
