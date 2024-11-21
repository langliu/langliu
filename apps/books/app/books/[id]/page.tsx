import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

function getBookArticles(bookId: string) {
  // 使用 bookId 过滤 article
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      articles: {
        orderBy: {
          order: 'asc',
        },
        select: {
          order: true,
          title: true,
          id: true,
        },
      },
    },
  })
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const bookId = (await params).id
  // 获取关联的文章
  const book = await getBookArticles(bookId)
  if (!book) {
    return null
  }
  return (
    <div className={'p-4 pb-10'}>
      <div className={'mb-4 flex gap-3'}>
        {book.cover && (
          <Image alt={book.title} src={book.cover} width={80} height={160} className={'rounded'} />
        )}
        <div className={'flex-1'}>
          <h3 className={'mb-2 font-medium text-base'}>{book.title}</h3>
          <p className={'line-clamp-2 overflow-hidden text-ellipsis text-muted-foreground text-sm'}>
            {book.introduction}
          </p>
        </div>
      </div>
      <ul className={'flex flex-col gap-2'}>
        {book.articles.map((article) => (
          <Link href={`/articles/${article.id}`} key={article.id} className={'h-6'}>
            第{article.order}章&nbsp;{article.title}
          </Link>
        ))}
      </ul>
    </div>
  )
}
