import { NavBreadcrumb } from '@/components/nav-breadcrumb'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { dateFormat } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { EditSheet } from './edit-sheet'

export const metadata: Metadata = {
  title: '书籍管理',
}

export const dynamic = 'force-dynamic'

async function getBooks() {
  const books = await prisma.book.findMany()
  const authors = await prisma.author.findMany()

  return {
    books,
    authors,
  }
}

export default async function Home() {
  const { books, authors } = await getBooks()
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
      <NavBreadcrumb
        breadcrumbList={breadcrumbList}
        addonAfter={
          <Link href={'/dashboard/books/create'}>
            <Button variant={'outline'}>
              <PlusCircle />
              新建书籍
            </Button>
          </Link>
        }
      />
      <main className='row-start-2 flex flex-col gap-8 p-4 pt-0 sm:items-start'>
        <Table className={'border'}>
          <TableHeader>
            <TableRow className={'font-bold'}>
              <TableCell>书籍封面</TableCell>
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
                  {book.cover && (
                    <Image src={book.cover} alt={book.title} width={90} height={160} />
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/dashboard/books/${book.id}`}>{book.title}</Link>
                </TableCell>
                <TableCell>{book.chapters}</TableCell>
                <TableCell>{book.wordCount}</TableCell>
                <TableCell>{dateFormat(book.createdAt)}</TableCell>
                <TableCell>{dateFormat(book.updatedAt)}</TableCell>
                <TableCell className={'w-[80px]'}>
                  <EditSheet book={book} authors={authors} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}
