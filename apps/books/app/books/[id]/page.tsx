import prisma from '@/lib/prisma'
import Link from 'next/link'

function getBookArticles(bookId: string) {
  // 使用 bookId 过滤 article
  return prisma.article.findMany({
    where: {
      bookId: bookId,
    },
    orderBy: {
      order: 'asc',
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
  const bookArticles = await getBookArticles(bookId)
  console.log(bookArticles)
  return (
    <div>
      My Post: {bookId}
      <ul className={'flex flex-col gap-2'}>
        {bookArticles.map((article) => (
          <Link href={`/articles/${article.id}`} key={article.id}>
            <p>
              第{article.order}章&nbsp;{article.title}
            </p>
          </Link>
        ))}
      </ul>
    </div>
  )
}
