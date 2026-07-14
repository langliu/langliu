import Link from 'next/link'
import Badge from '@/components/Badges'
import SupabaseImage from '@/components/SupabaseImage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDateToLocal } from '@/libs/utils'
import type { Database } from '@/types/supabase'
import { fetchFilteredInvoices } from './actions'
import Edit from './Edit'
import Pagination from './Pagination'
import InvoiceStatus from './Status'

export default async function InvoicesTable({
  query,
  currentPage,
  modelId,
  models = [],
  organizations = [],
}: {
  query: string
  currentPage: number
  modelId?: string
  models?: Database['public']['Tables']['models']['Row'][]
  organizations: Database['public']['Tables']['organizations']['Row'][]
}) {
  const { albums: invoices, total } = await fetchFilteredInvoices(query, currentPage, modelId)
  return (
    <>
      <ScrollArea className='w-full'>
        <div className='md:hidden'>
          {invoices?.map((invoice) => (
            <div key={invoice.id} className='mb-2 w-full rounded-md bg-white p-4'>
              <div className='flex items-center justify-between border-b pb-4'>
                <div>
                  <div className='mb-2 flex items-center'>
                    <SupabaseImage src={invoice.cover} alt={`${invoice.name}'s profile picture`} />
                  </div>
                </div>
              </div>
              <div className='flex w-full items-center justify-between pt-4'>
                <div>
                  <p className='flex items-center gap-2 font-medium text-xl'>
                    {invoice.name}
                    <span className='text-gray-400 text-sm'>
                      {invoice.picture_num}P {invoice.video_num}V
                    </span>
                  </p>
                  <InvoiceStatus status={invoice.collected} />
                  <div className='flex gap-2'>
                    {invoice.models.map((model) => {
                      return (
                        <Link href={`/models?query=${model.username}`} key={model.id}>
                          <Badge type='indigo'>{model.username}</Badge>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <table className='hidden min-w-full text-gray-900 md:table'>
          <thead className='sticky top-0 rounded-lg bg-gray-50 text-left font-normal text-sm'>
            <tr>
              <th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
                专辑
              </th>
              <th scope='col' className='px-4 py-5 font-medium sm:pl-6'>
                模特
              </th>
              <th scope='col' className='px-3 py-5 font-medium'>
                图片数量
              </th>
              <th scope='col' className='px-3 py-5 font-medium'>
                视频数量
              </th>
              <th scope='col' className='px-3 py-5 font-medium'>
                所属机构
              </th>
              <th scope='col' className='px-3 py-5 font-medium'>
                添加时间
              </th>
              <th scope='col' className='px-3 py-5 font-medium'>
                状态
              </th>
              <th scope='col' className='relative py-3 pr-3 pl-6'>
                <span className='sr-only'>Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {invoices?.map((invoice) => (
              <tr
                key={invoice.id}
                className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
              >
                <td className='whitespace-nowrap py-3 pr-3 pl-6'>
                  <div className='flex items-center gap-3'>
                    <SupabaseImage src={invoice.cover} alt={`${invoice.name}'s profile picture`} />
                    <p>{invoice.name}</p>
                  </div>
                </td>
                <td className='whitespace-nowrap px-3 py-3'>
                  <div className='flex gap-2'>
                    {invoice.models.map((model) => {
                      return (
                        <Link href={`/dashboard/models?query=${model.username}`} key={model.id}>
                          <Badge type='indigo'>{model.username}</Badge>
                        </Link>
                      )
                    })}
                  </div>
                </td>
                <td className='whitespace-nowrap px-3 py-3'>{invoice.picture_num}</td>
                <td className='whitespace-nowrap px-3 py-3'>{invoice.video_num}</td>
                <td className='whitespace-nowrap px-3 py-3'>{invoice.organizations?.name}</td>
                <td className='whitespace-nowrap px-3 py-3'>
                  {formatDateToLocal(invoice.created_at)}
                </td>
                <td className='whitespace-nowrap px-3 py-3'>
                  <InvoiceStatus status={invoice.collected} />
                </td>
                <td className='whitespace-nowrap py-3 pr-3 pl-6'>
                  <Edit id={invoice.id} models={models} organizations={organizations} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
      <Pagination total={total ?? 0} current={currentPage} />
    </>
  )
}
