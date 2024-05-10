import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { message } from 'antd'
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
      message.error(error?.message)
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
    <div className='antialiased font-sans px-2 flex flex-col gap-6 pt-2'>
      <div className='flex gap-4'>
        <Search placeholder='请输入模特名称' />
        <CreateModel />
      </div>
      <ModelsTable data={data ?? []} />
    </div>
  )
}
