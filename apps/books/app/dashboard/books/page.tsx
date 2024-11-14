import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import Link from 'next/link'

async function getBooks() {
  const books = await prisma.book.findMany()

  return {
    books,
  }
}

export default async function Home() {
  const { books } = await getBooks()
  console.log(books)

  return (
    <main className='row-start-2 flex flex-col gap-8 p-4 sm:items-start'>
      <h1 className={'font-bold text-2xl'}>书籍管理</h1>
      <Table className={'border'}>
        <TableHeader>
          <TableRow className={'font-bold'}>
            <TableCell>书籍名称</TableCell>
            <TableCell>字数</TableCell>
            <TableCell>创建时间</TableCell>
            <TableCell>更新时间</TableCell>
            <TableCell className={'w-[120px]'}>操作</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>
                <Link href={`/dashboard/books/${book.id}`}>{book.title}</Link>
              </TableCell>
              <TableCell>{book.wordCount}</TableCell>
              <TableCell>{book.createdAt.toLocaleString()}</TableCell>
              <TableCell>{book.updatedAt.toLocaleString()}</TableCell>
              <TableCell className={'w-[120px]'}>
                <span>编辑</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}
