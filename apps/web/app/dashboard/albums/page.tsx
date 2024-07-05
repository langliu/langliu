import DashboardHeader from '@/components/DashboardHeader'
import { InvoicesTableSkeleton } from './Skeletons'
import Table from './Table'
import Search from '@/components/Search'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { getAllModels, getAllOrganizations } from './actions'
import ModelSelect from './ModelSelect'
import Create from './Create'

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/albums/create"
      className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'ml-auto gap-1.5',
      })}
    >
      <Plus className="size-3.5" />
      <span>新建专辑</span>
    </Link>
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string
    page?: string
    model?: string
  }
}) {
  const query = searchParams?.query || ''
  const modelId = searchParams?.model
  const currentPage = Number(searchParams?.page) || 1
  const models = await getAllModels()
  const organizations = await getAllOrganizations()

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader
        title="专辑管理"
        extra={<Create models={models} organizations={organizations} />}
      />
      <div className="p-4 flex-1 overflow-hidden flex flex-col gap-4">
        <div className="flex gap-4">
          <Search placeholder="请输入专辑名称" />
          <ModelSelect models={models} />
        </div>
        <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
          <Table
            query={query}
            modelId={modelId}
            currentPage={currentPage}
            models={models}
            organizations={organizations}
          />
        </Suspense>
      </div>
    </div>
  )
}
