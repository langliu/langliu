import { Plus, X } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Search from '@/components/Search'
import { Button, buttonVariants } from '@/components/ui/button'
import { getAllModels, getAllOrganizations } from './actions'
import Create from './Create'
import ModelSelect from './ModelSelect'
import { InvoicesTableSkeleton } from './Skeletons'
import Table from './Table'
// import { useRouter } from 'next/navigation'

export function CreateInvoice() {
  return (
    <Link
      href='/dashboard/albums/create'
      className={buttonVariants({
        variant: 'outline',
        size: 'sm',
        className: 'ml-auto gap-1.5',
      })}
    >
      <Plus className='size-3.5' />
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
  // const { replace } = useRouter()
  const query = searchParams?.query || ''
  const modelId = searchParams?.model
  const currentPage = Number(searchParams?.page) || 1
  const models = await getAllModels()
  const organizations = await getAllOrganizations()

  return (
    <div className='flex h-screen flex-col'>
      <DashboardHeader
        title='专辑管理'
        extra={<Create models={models} organizations={organizations} />}
      />
      <div className='flex flex-1 flex-col gap-4 overflow-hidden p-4'>
        <div className='flex gap-4'>
          <Search placeholder='请输入专辑名称' />
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
