import Link from 'next/link'
import { supabase } from '@/libs/supabaseClient'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export async function getData(query: unknown, current: string | number) {
  const { data } = await supabase.from('books').select('*')
  return data
}

export type OrganizationsTableProps = {
  query: string
  currentPage: number
}

export default async function OrganizationsTable({ query, currentPage }: OrganizationsTableProps) {
  const invoices = await getData(query, currentPage)

  return (
    <Table className="flex-1">
      <TableHeader className="sticky top-0">
        <TableRow>
          <TableHead>书名</TableHead>
          <TableHead>作者</TableHead>
          <TableHead>状态</TableHead>
          <TableHead className='w-[120px]'>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices?.map((book) => (
          <TableRow key={book.id}>
            <TableCell>{book.name}</TableCell>
            <TableCell>{book.author ?? '未知'}</TableCell>
            <TableCell>{book.end ? '完结' : '连载'}</TableCell>
            <TableCell>
              <Link href={`/dashboard/books/${book.id}`}>查看</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
