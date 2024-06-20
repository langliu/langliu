import Pagination from '@/components/Pagination'
import DashboardHeader from '@/components/DashboardHeader'
import Search from '@/components/Search'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { InvoicesTableSkeleton } from './Skeletons'
import Table from './Table'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/organizations/create"
      className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'ml-auto gap-1.5',
      })}
    >
      <Plus className="size-3.5" />
      <span>新建机构</span>
    </Link>
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
  }
}) {
  const query = searchParams?.query || ''
  const currentPage = Number(searchParams?.page) || 1
  // const totalPages = await fetchInvoicesPages(query)

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader title="机构管理" extra={<CreateInvoice />} />
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-4">
          <Search placeholder="请输入机构名称" />
        </div>
        <ScrollArea className="rounded-md border flex-1 relative h-screen">
          <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
            <Table query={query} currentPage={currentPage} />
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  )
}
