import { HomeOutlined, InstagramOutlined, TwitterOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import Image from 'next/image'
import Link from 'next/link'

import UpdateModel from './UpdateModel'
export interface ModelsTableProps {
  record: any[]
}

export default function ModelsTable(params: ModelsTableProps) {
  return (
    <>
      <table className='hidden min-w-full text-gray-900 md:table'>
        <thead className='rounded-lg text-left text-sm bg-gray-100 font-bold'>
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
            <th scope='col' className='px-3 py-5' />
          </tr>
        </thead>
        <tbody className='bg-white'>
          {params?.data?.map((record) => (
            <tr
              key={record.id}
              className='w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg'
            >
              <td className='whitespace-nowrap py-3 pl-6 pr-3'>
                <div className='flex items-center gap-3'>
                  {record?.avatar && (
                    <Popover
                      content={
                        <Image
                          src={record?.avatar}
                          width={400}
                          height={400}
                          alt={`${record.username}的头像`}
                        />
                      }
                      title={record.username}
                      placement='right'
                    >
                      <Image
                        src={record?.avatar}
                        className='rounded-full object-cover w-16 h-16'
                        width={64}
                        height={64}
                        alt={`${record.username}的头像`}
                      />
                    </Popover>
                  )}
                  <p>{record.username}</p>
                </div>
              </td>
              <td className='whitespace-nowrap px-3 py-3'>
                <span className='inline-flex items-center gap-2'>
                  {record?.homepage && (
                    <Link href={record.homepage} target='_blank'>
                      <HomeOutlined className='text-xl' />
                    </Link>
                  )}
                  {record?.instagram && (
                    <Link href={record.instagram} target='_blank'>
                      <InstagramOutlined className='text-xl' />
                    </Link>
                  )}
                  {record?.twitter && (
                    <Link href={record.twitter} target='_blank'>
                      <TwitterOutlined className='text-xl' />
                    </Link>
                  )}
                </span>
              </td>
              <td className='whitespace-nowrap px-3 py-3'>{record.created_at}</td>
              <td className='whitespace-nowrap px-3 py-3'>{record.updated_at}</td>
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
    </>
  )
}
