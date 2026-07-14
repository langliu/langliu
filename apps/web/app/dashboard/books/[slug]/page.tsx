import { Plus } from 'lucide-react'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { Button, buttonVariants } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/libs/supabaseClient'
import { CreateDrawer } from './CreateDrawer'
import styles from './page.module.css'

type Props = {
  params: {
    slug: string
  }
}

export async function getData(bookId: string) {
  noStore()
  const { data } = await supabase
    .from('articles')
    .select('id,title,serial,bookId')
    .eq('bookId', bookId)
    .order('serial', { ascending: true })
  const { data: book } = await supabase.from('books').select().eq('id', bookId)
  return {
    data,
    book,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = params
  const { data, book } = await getData(slug)

  return (
    <div className={'flex h-screen flex-col'}>
      <DashboardHeader
        title={
          <>
            {book?.[0].name}
            <span className='font-normal text-sm'>（共{data?.length}章）</span>
          </>
        }
        extra={<CreateDrawer bookId={slug} last={(data?.length ?? 0) + 1} />}
      />
      <ScrollArea className='flex-1 overflow-y-auto p-4'>
        <ul className={'grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}>
          {data?.map((country) => (
            <Link
              href={`/articles/${country.id}`}
              className={'flex h-10 w-full items-center rounded-lg px-4 hover:bg-muted/50'}
              key={country.id}
            >
              <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
                {country.title.includes('章') ? '' : `第${country.serial}章 `}
                {country.title}
              </span>
            </Link>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
