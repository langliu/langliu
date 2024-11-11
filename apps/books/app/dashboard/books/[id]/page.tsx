import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { CreateSheet } from './create-sheet'
import { EditSheet } from './edit-sheet'

function getBookArticles(bookId: string) {
  // 使用 bookId 过滤 article
  return prisma.article.findMany({
    where: {
      bookId: bookId,
    },
    orderBy: {
      order: 'asc',
    },
    select: {
      id: true,
      title: true,
      order: true,
    },
  })
}

function getBookDetail(bookId: string) {
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
  })
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const bookId = (await params).id
  // 获取关联的文章
  const bookArticles = await getBookArticles(bookId)
  const book = await getBookDetail(bookId)
  console.log(bookArticles)
  return (
    <div className={'w-full p-4'}>
      <h1 className={'mb-4 text-2xl'}>{book?.title}</h1>
      <Table className={'border'}>
        <TableHeader>
          <TableRow>
            <TableCell>序号</TableCell>
            <TableCell>章节名称</TableCell>
            <TableCell className={'w-[150px]'}>操作</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookArticles?.map((bookArticle) => (
            <TableRow key={bookArticle.id}>
              <TableCell>{bookArticle.order}</TableCell>
              <TableCell>{bookArticle.title}</TableCell>
              <TableCell className={'flex w-[150px] gap-2'}>
                <CreateSheet bookId={bookId} />
                <EditSheet bookId={bookArticle.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
