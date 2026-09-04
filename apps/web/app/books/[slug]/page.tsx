import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { createClient } from '@/libs/supabase/server'
import styles from './page.module.css'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export const runtime = 'edge'
export async function getData(bookId: string) {
  const supabase = await createClient()
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
  const { slug } = await params
  const { data, book } = await getData(slug)

  return (
    <div className={styles.wrapper}>
      <div className={styles.book}>
        <Link href={'/books'} className={styles.navigate}>
          {'🔙'}
        </Link>
        <h3 className={styles.title}>{book?.[0].name}</h3>
        <span>（共{data?.length}章）</span>
        <Link href={`/articles/create?bookId=${slug}`}>新建章节</Link>
      </div>
      <ul className={styles.list}>
        {data?.map((country) => (
          <Link href={`/articles/${country.id}`} key={country.id} className={styles.listItem}>
            <li key={country.id}>
              {country.title.includes('章') ? '' : `第${country.serial}章 `}
              {country.title}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
