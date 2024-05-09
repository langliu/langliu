import styles from './page.module.css'
import { supabase } from '@/libs/supabaseClient'
import Link from 'next/link'

type Props = {
  params: {
    slug: string
  }
}

export const runtime = 'edge'

export async function getData(id: string) {
  const { data } = await supabase
    .from('articles')
    .select('id,title,content,bookId,serial')
    .eq('id', id)
  const { data: articles } = await supabase
    .from('articles')
    .select('id,serial')
    .eq('bookId', data?.[0].bookId)
    .order('serial', { ascending: true })
  const currentIndex = articles?.findIndex((item) => item.serial === data?.[0].serial) ?? 0
  return {
    article: data?.[0],
    hasNextPage: currentIndex < (articles?.length ?? 0) - 1,
    nextPage: articles?.[currentIndex + 1]?.id,
    hasPreviousPage: currentIndex !== 0,
    previousPage: articles?.[currentIndex - 1]?.id,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = params
  const { article, hasNextPage, hasPreviousPage, nextPage, previousPage } = await getData(slug)

  const pa = (content: string) => {
    const arr = [...new Set(content?.split('\n') ?? [])]
    return (
      <>
        {arr.map((item) => (
          <p key={item} className={styles.paragraph}>
            {item.trim()}
          </p>
        ))}
      </>
    )
  }
  return (
    <div>
      <div className={styles.content}>
        <h2 className={'mb-4 text-2xl'}>第{article?.serial}章 {article?.title}</h2>
        <div key={article?.id}>{pa(article?.content)}</div>
      </div>
      <div className={styles.chapterControl}>
        {hasPreviousPage ? (
          <Link href={`/articles/${previousPage}`}>上一章</Link>
        ) : (
          <p className={styles.disable}>上一章</p>
        )}
        <span className={styles.divider}>|</span>
        <Link href={`/books/${article?.bookId}`}>目录</Link>
        <span className={styles.divider}>|</span>
        {hasNextPage ? (
          <Link href={`/articles/${nextPage}`}>下一章</Link>
        ) : (
          <p className={styles.disable}>下一章</p>
        )}
      </div>
    </div>
  )
}
