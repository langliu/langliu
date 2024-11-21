import { NavActions } from '@/app/dashboard/books/[id]/anv-actions'
import { NavBreadcrumb } from '@/components/nav-breadcrumb'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'
import { EditSheet } from './edit-sheet'

export const metadata: Metadata = {
  title: '书籍详情',
}

function getBookDetail(bookId: string) {
  return prisma.book.findUnique({
    where: {
      id: bookId,
    },
    include: {
      articles: {
        orderBy: {
          order: 'desc',
        },
        select: {
          id: true,
          title: true,
          order: true,
          wordCount: true,
        },
      },
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
  const book = await getBookDetail(bookId)
  console.log(book.chapters)
  return (
    <>
      <NavBreadcrumb
        breadcrumbList={[
          { title: '书籍管理', href: '/dashboard/books' },
          { title: '书籍列表', href: '/dashboard/books' },
          { title: book?.title ?? '' },
        ]}
        addonAfter={<NavActions bookId={bookId} chapters={book.chapters} />}
      />
      <div className={'w-full p-4 pt-0'}>
        <Table className={'border'}>
          <TableHeader>
            <TableRow>
              <TableCell>序号</TableCell>
              <TableCell>章节名称</TableCell>
              <TableCell>字数统计</TableCell>
              <TableCell className={'w-[150px] text-center'}>操作</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {book.articles?.map((bookArticle) => (
              <TableRow key={bookArticle.id}>
                <TableCell>{bookArticle.order}</TableCell>
                <TableCell>{bookArticle.title}</TableCell>
                <TableCell>{bookArticle.wordCount}</TableCell>
                <TableCell className={'flex w-[150px] gap-2'}>
                  <EditSheet id={bookArticle.id} bookId={bookId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
