import { DashboardHeader } from '@/components/DashboardHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/libs/supabase/server'
import CreateModel from './CreateModel'
import ModelsTable from './ModelsTable'
import Search from './Search'
import Pagination from '@/components/Pagination'

async function getData(query?: string, page = 1) {
  const supabase = createClient()
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
  searchParams: {
    query?: string
    page?: string
  }
}

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const currentPage = Number(searchParams?.page) || 1
  const { list, total } = await getData(searchParams?.query, currentPage)

  return (
    <div className="antialiased font-sans flex flex-col gap-2 h-screen">
      <DashboardHeader title="模特管理" extra={<CreateModel />} />
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-4">
          <Search placeholder="请输入模特名称" />
        </div>
        <ScrollArea className="rounded-md border flex-1 relative h-screen">
          <ModelsTable data={list ?? []} />
        </ScrollArea>
        <Pagination currentPage={currentPage} totalPages={Math.round((total ?? 0) / 10)} />
      </div>
    </div>
  )
}
