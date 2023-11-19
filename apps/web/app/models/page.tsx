import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { message } from 'antd'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

import CreateModel from './CreateModel'
import ModelsTable from './ModelsTable'
import Search from './Search'

async function getData() {
  const supabase = createServerComponentClient({ cookies })
  try {
    const { data: models, error } = await supabase.from('models').select('*')
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

export default async function ModelsPage() {
  const data = await getData()
  console.log('data', data)
  return (
    <div className='antialiased font-sans xl:px-20 px-2 flex flex-col gap-6 xl:pt-16 pt-2'>
      <div className='flex gap-4'>
        <Search placeholder='请输入模特名称' />
        <CreateModel />
      </div>
      <ModelsTable data={data ?? []} />
    </div>
  )
}
