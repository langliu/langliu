import styles from './page.module.css'
import { supabase } from '@/libs/supabaseClient'
import Link from 'next/link'

type Props = {
  params: {
    slug: string
  }
}

export const runtime = 'edge'
export async function getData(bookId: string) {
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
    <div className={styles.wrapper}>
      <div className={styles.book}>
        <Link href={'/books'} className={styles.navigate}>
          {'🔙'}
        </Link>
        <h3 className={styles.title}>{book?.[0].name}</h3>
        <span>（共{data?.length}章）</span>
      </div>
      <ul className={styles.list}>
        {data?.map((country) => (
          <Link href={`/articles/${country.id}`}>
            <li key={country.id} className={styles.listItem}>
              {country.title.includes('章') ? '' : `第${country.serial}章 `}
              {country.title}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  )
}
