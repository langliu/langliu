import styles from './page.module.css'
import { supabase } from '@/libs/supabaseClient'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { DashboardHeader } from '@/components/DashboardHeader'
import { Button, buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateDrawer } from './CreateDrawer'

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
    <div className={'h-screen flex flex-col'}>
      <DashboardHeader
        title={
          <>
            {book?.[0].name}
            <span className="text-sm font-normal">（共{data?.length}章）</span>
          </>
        }
        extra={<CreateDrawer bookId={slug} />}
      />
      <ScrollArea className="p-4 flex-1 overflow-y-auto">
        <ul className={'grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'}>
          {data?.map((country) => (
            <Link
              href={`/articles/${country.id}`}
              className={
                'h-10 rounded-lg px-4 flex items-center hover:bg-muted/50  text-ellipsis overflow-hidden whitespace-nowrap w-full'
              }
            >
              <li key={country.id}>
                {country.title.includes('章') ? '' : `第${country.serial}章 `}
                {country.title}
              </li>
            </Link>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}
