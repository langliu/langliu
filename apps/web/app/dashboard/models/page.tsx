import { toast } from '@langliu/ui/hooks/use-toast'
import { ScrollArea } from '@langliu/ui/ui/scroll-area'
import { DashboardHeader } from '@/components/DashboardHeader'
import Pagination from '@/components/Pagination'
import { createClient } from '@/libs/supabase/server'
import CreateModel from './CreateModel'
import ModelsTable from './ModelsTable'
import Search from './Search'

async function getData(query?: string, page = 1) {
  const supabase = await createClient()
  const start = (page - 1) * 10
  try {
    const {
      data: models,
      error,
      count,
    } = await supabase
      .from('models')
      .select('*', { count: 'exact' })
      .like('username', `%${query ?? ''}%`)
      .order('updated_at', { ascending: false })
      .range(start, start + 10)
    if (error) {
      throw error
    }
    console.log('count', count)

    return {
      total: count,
      list: models,
    }
  } catch (error) {
    if (error instanceof Error) {
      toast({
        variant: 'destructive',
        description: error?.message,
      })
    }
  }
}

interface ModelsPageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const resolvedSearchParams = await searchParams
  const currentPage = Number(resolvedSearchParams?.page) || 1
  const { list, total } = (await getData(resolvedSearchParams?.query, currentPage)) ?? {
    list: [],
    total: 0,
  }

  return (
    <div className='flex h-screen flex-col gap-2 font-sans antialiased'>
      <DashboardHeader title='模特管理' extra={<CreateModel />} />
      <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4'>
        <div className='flex gap-4'>
          <Search placeholder='请输入模特名称' />
        </div>
        <ScrollArea className='relative h-screen flex-1 rounded-md border'>
          <ModelsTable data={list ?? []} />
        </ScrollArea>
        <Pagination currentPage={currentPage} totalPages={Math.round((total ?? 0) / 10)} />
      </div>
    </div>
  )
}
