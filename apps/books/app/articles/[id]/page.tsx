import prisma from '@/lib/prisma'

function getBookArticles(articleId: string) {
  // 使用 bookId 过滤 article
  return prisma.article.findUnique({
    where: {
      id: articleId,
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
  const article = await getBookArticles(bookId)

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
    </div>
  )
}
