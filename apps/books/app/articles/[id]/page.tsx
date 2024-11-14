import prisma from '@/lib/prisma'
import Link from 'next/link'

function getBookArticles(articleId: string) {
  // 使用 bookId 过滤 article
  return prisma.article.findUnique({
    where: {
      id: articleId,
    },
  })
}

async function gerPrevAndNextPage(bookId: string, order: number) {
  const res = await prisma.article.findMany({
    where: {
      bookId: bookId,
      order: {
        in: [order - 1, order + 1],
      },
    },
    select: {
      id: true,
      title: true,
      order: true,
    },
  })
  return {
    prev: res.find((item) => item.order === order - 1),
    next: res.find((item) => item.order === order + 1),
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const articleId = (await params).id
  // 获取关联的文章
  const article = await getBookArticles(articleId)
  if (!article) {
    return null
  }
  const prevAndNextPage = await gerPrevAndNextPage(article?.bookId, article?.order ?? 0)
  console.log('prevAndNextPage', prevAndNextPage)
  return (
    <div className={'p-4 pt-0'}>
      <h1 className={'sticky top-0 mb-2 bg-white pt-4 pb-2 font-bold text-xl'}>
        第{article?.order ?? 1}章 {article?.title ?? ''}
      </h1>
      <div className={'mb-2 whitespace-break-spaces leading-6'}>
        {(article?.content.split('\n') ?? []).map((p, index) => {
          const key = p + index
          return (
            <p key={key} className={'mb-3 font-normal text-lg'}>
              {p}
            </p>
          )
        })}
      </div>
      <div className={'grid grid-cols-3 gap-4 border border-gray-200'}>
        {prevAndNextPage.prev ? (
          <Link href={`/articles/${prevAndNextPage.prev.id}`} className={'px-4 py-2 text-center'}>
            上一章
          </Link>
        ) : (
          <div className={'px-4 py-2 text-center text-gray-400'}>上一章</div>
        )}
        <Link
          href={`/books/${article.bookId}`}
          className={'cursor-pointer border-gray-200 border-r border-l px-4 py-2 text-center'}
        >
          目录
        </Link>
        {prevAndNextPage.next ? (
          <Link className={'px-4 py-2 text-center'} href={`/articles/${prevAndNextPage.next.id}`}>
            下一章
          </Link>
        ) : (
          <div className={'px-4 py-2 text-center text-gray-400'}>下一章</div>
        )}
      </div>
    </div>
  )
}
