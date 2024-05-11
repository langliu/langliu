import DashboardHeader from '@/components/DashboardHeader'
import Table from './Table'
import Pagination from '@/components/Pagination'
import Search from '@/components/Search'
import { PlusIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { Suspense } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/libs/supabaseClient'

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/albums/create"
      className={buttonVariants({ variant: 'outline', size: 'sm', className: 'ml-auto gap-1.5' })}
    >
      <PlusIcon className="size-3.5" />
      <span>新建专辑</span>
    </Link>
  )
}

export async function getData() {
  const { data } = await supabase.from('books').select('*')
  return data
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
      <DashboardHeader title="书籍管理" extra={<CreateInvoice />} />
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-4">
          <Search placeholder="请输入书籍名称" />
        </div>
        <ScrollArea className="rounded-md border flex-1 h-screen">
          <Suspense key={query + currentPage} fallback={'<InvoicesTableSkeleton />'}>
            <Table query={query} currentPage={currentPage} />
          </Suspense>
        </ScrollArea>
      </div>
    </div>
  )
}
