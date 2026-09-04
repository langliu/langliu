import { Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDateToLocal } from '@/libs/utils/index'
import type { Database } from '@/types/supabase'
import Avatar from './Avatar'
import UpdateModel from './UpdateModel'

export interface ModelsTableProps {
  data: Database['public']['Tables']['models']['Row'][]
}

export default function ModelsTable(params: ModelsTableProps) {
  return (
    <table className='hidden min-w-full text-gray-900 md:table'>
      <thead className='sticky top-0 rounded-lg bg-gray-100 text-left font-bold text-sm'>
        <tr>
          <th scope='col' className='px-4 py-5 sm:pl-6'>
            模特
          </th>
          <th scope='col' className='px-3 py-5'>
            社交媒体
          </th>
          <th scope='col' className='px-3 py-5'>
            创建日期
          </th>
          <th scope='col' className='px-3 py-5'>
            更新日期
          </th>
          <th scope='col' className='px-3 py-5'>
            操作
          </th>
        </tr>
      </thead>
      <tbody className='bg-white'>
        {params?.data?.map((record) => (
          <tr
            key={record.id}
            className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
          >
            <td className='whitespace-nowrap py-3 pr-3 pl-6'>
              <div className='flex items-center gap-3'>
                <Avatar record={record} />
                <p>{record.username}</p>
              </div>
            </td>
            <td className='whitespace-nowrap px-3 py-3'>
              <span className='inline-flex items-center gap-2'>
                {record?.homepage && (
                  <Link href={record.homepage} target='_blank'>
                    <Home className='h-5 w-5' />
                  </Link>
                )}
                {record?.instagram && (
                  <Link href={record.instagram} target='_blank' title='Instagram'>
                    <svg
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path d='M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z' />
                    </svg>
                  </Link>
                )}
                {record?.twitter && (
                  <Link href={record.twitter} target='_blank' title='X / Twitter'>
                    <svg
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      aria-hidden='true'
                    >
                      <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
                    </svg>
                  </Link>
                )}
                {record?.weibo && (
                  <Link href={record.weibo} target='_blank'>
                    <Image
                      src={'/sina-weibo.svg'}
                      alt='新浪微博'
                      width={20}
                      height={20}
                      className='h-5 w-5'
                    />
                  </Link>
                )}
              </span>
            </td>
            <td className='whitespace-nowrap px-3 py-3'>{formatDateToLocal(record.created_at)}</td>
            <td className='whitespace-nowrap px-3 py-3'>{formatDateToLocal(record.updated_at)}</td>
            <td className='whitespace-nowrap px-3 py-3'>
              <UpdateModel record={record} />
            </td>
            {/* <td className='whitespace-nowrap px-3 py-3'>{formatCurrency(invoice.amount)}</td>
                  <td className='whitespace-nowrap px-3 py-3'>{formatDateToLocal(invoice.date)}</td> */}
            {/* <td className='whitespace-nowrap px-3 py-3'>
                <InvoiceStatus status={record?.status} />
              </td>
              <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                <div className='flex justify-end gap-3'>
                  <UpdateInvoice id={record?.id} />
                  <DeleteInvoice id={record?.id} />
                </div>
              </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
