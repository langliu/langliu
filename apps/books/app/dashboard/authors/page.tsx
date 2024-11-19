import { NavBreadcrumb } from '@/components/nav-breadcrumb'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma'
import { PlusCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '作者管理',
}

export const dynamic = 'force-dynamic'

async function getBooks() {
  const authors = await prisma.author.findMany()

  return {
    authors,
  }
}

export default async function AuthorsPage() {
  const { authors } = await getBooks()
  console.log(authors)
  const breadcrumbList = [
    {
      title: '书籍管理',
      href: '/dashboard/books',
    },
    {
      title: '作者列表',
    },
  ]

  return (
    <>
      <NavBreadcrumb
        breadcrumbList={breadcrumbList}
        addonAfter={
          <Link href={'/dashboard/authors/create'}>
            <Button variant={'ghost'}>
              <PlusCircle />
              新建作家
            </Button>
          </Link>
        }
      />
      <main className='row-start-2 flex flex-col gap-8 p-4 pt-0 sm:items-start'>
        <Table className={'border'}>
          <TableHeader>
            <TableRow className={'font-bold'}>
              <TableCell>作家名称</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell className={'w-[80px]'}>操作</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.name}</TableCell>
                <TableCell>{book.createdAt.toLocaleString()}</TableCell>
                <TableCell>{book.updatedAt.toLocaleString()}</TableCell>
                <TableCell className={'w-[80px]'}>
                  {/*<EditSheet book={book} authors={authors} />*/}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}
