import { NavBreadcrumb } from '@/components/nav-breadcrumb'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '书籍管理',
}

export const dynamic = 'force-dynamic'

async function getBooks() {
  const books = await prisma.book.findMany()

  return {
    books,
  }
}

export default async function Home() {
  const { books } = await getBooks()
  console.log(books)
  const breadcrumbList = [
    {
      title: '书籍管理',
      href: '/dashboard/books',
    },
    {
      title: '书籍列表',
    },
  ]
  return (
    <>
      <NavBreadcrumb breadcrumbList={breadcrumbList} />
      <main className='row-start-2 flex flex-col gap-8 p-4 pt-0 sm:items-start'>
        <Table className={'border'}>
          <TableHeader>
            <TableRow className={'font-bold'}>
              <TableCell>书籍名称</TableCell>
              <TableCell>章节数</TableCell>
              <TableCell>字数</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell className={'w-[80px]'}>操作</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Link href={`/dashboard/books/${book.id}`}>{book.title}</Link>
                </TableCell>
                <TableCell>{book.chapters}</TableCell>
                <TableCell>{book.wordCount}</TableCell>
                <TableCell>{book.createdAt.toLocaleString()}</TableCell>
                <TableCell>{book.updatedAt.toLocaleString()}</TableCell>
                <TableCell className={'w-[80px]'}>
                  <span>编辑</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}
