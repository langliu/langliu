import { formatDateToLocal } from '@/libs/utils'
import Link from 'next/link'
import { fetchFilteredInvoices } from './actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type OrganizationsTableProps = {
  query: string
  currentPage: number
}

export default async function OrganizationsTable({ query, currentPage }: OrganizationsTableProps) {
  const invoices = await fetchFilteredInvoices(query, currentPage)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>名称</TableHead>
          <TableHead>地址</TableHead>
          <TableHead>添加时间</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices?.map((invoice) => (
          <TableRow>
            <TableCell>{invoice.name}</TableCell>
            <TableCell>
              {invoice.url && (
                <Link href={invoice.url} key={invoice.url} target="_blank">
                  访问地址
                </Link>
              )}
            </TableCell>
            <TableCell>{formatDateToLocal(invoice.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
