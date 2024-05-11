import { DashboardHeader } from '@/components/DashboardHeader'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/components/ui/use-toast'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Share } from 'lucide-react'
import { cookies } from 'next/headers'
import CreateModel from './CreateModel'
import ModelsTable from './ModelsTable'
import Search from './Search'

async function getData(query?: string) {
  const supabase = createServerComponentClient({ cookies })
  try {
    const { data: models, error } = await supabase
      .from('models')
      .select('*')
      .like('username', `%${query ?? ''}%`)
      .order('updated_at', { ascending: false })
    if (error) {
      throw error
    }

    return models
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
  const data = await getData(searchParams?.query)

  return (
    <div className="antialiased font-sans flex flex-col gap-2 h-screen">
      <DashboardHeader
        title="模特管理"
        extra={
          <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-sm">
            <Share className="size-3.5" />
            Share
          </Button>
        }
      />
      <div className="p-4 flex-1 flex flex-col gap-4 overflow-y-auto">
        <div className="flex gap-4">
          <Search placeholder="请输入模特名称" />
          <CreateModel />
        </div>
        <ScrollArea className="rounded-md border flex-1 relative h-screen">
          <ModelsTable data={data ?? []} />
        </ScrollArea>
      </div>
    </div>
  )
}
