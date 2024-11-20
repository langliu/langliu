import { getCategories } from '@/actions/categories'
import { NavBreadcrumb } from '@/components/nav-breadcrumb'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { dateFormat } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '标签管理',
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const { categories } = await getCategories()
  console.log(categories)
  const breadcrumbList = [
    {
      title: '书籍管理',
      href: '/dashboard/books',
    },
    {
      title: '标签管理',
    },
  ]

  return (
    <>
      <NavBreadcrumb
        breadcrumbList={breadcrumbList}
        addonAfter={
          <Link href={'/dashboard/categories/create'}>
            <Button variant={'outline'}>
              <PlusCircle />
              新建标签
            </Button>
          </Link>
        }
      />
      <main className='row-start-2 flex flex-col gap-8 p-4 pt-0 sm:items-start'>
        <Table className={'border'}>
          <TableHeader>
            <TableRow className={'font-bold'}>
              <TableCell>标签名称</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell>更新时间</TableCell>
              <TableCell className={'w-[80px]'}>操作</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{dateFormat(category.createdAt)}</TableCell>
                <TableCell>{dateFormat(category.updatedAt)}</TableCell>
                <TableCell className={'w-[80px]'}>
                  <Link href={`/dashboard/categories/${category.id}`}>编辑</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </>
  )
}
