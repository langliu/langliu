import Badge from '@/components/Badges'
import SupabaseImage from '@/components/SupabaseImage'
import { formatCurrency, formatDateToLocal } from '@/libs/utils'
import Link from 'next/link'
import InvoiceStatus from './Status'
import { fetchFilteredInvoices } from './actions'

export default async function InvoicesTable({
  query,
  currentPage,
}: {
  query: string
  currentPage: number
}) {
  const invoices = await fetchFilteredInvoices(query, currentPage)

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div key={invoice.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <SupabaseImage
                        src={invoice.cover}
                        alt={`${invoice.name}'s profile picture`}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium flex gap-2 items-center">
                      {invoice.name}
                      <span className="text-sm text-gray-400">
                        {invoice.picture_num}P {invoice.video_num}V
                      </span>
                    </p>
                    <InvoiceStatus status={invoice.collected} />
                    <div className="flex gap-2">
                      {invoice.models.map((model) => {
                        return (
                          <Link href={`/models?query=${model.username}`} key={model.id}>
                            <Badge type="indigo">{model.username}</Badge>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  名称
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  地址
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  添加时间
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {invoices?.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{invoice.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {invoice.url && (
                      <Link href={invoice.url} key={invoice.url}>
                        访问地址
                      </Link>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {formatDateToLocal(invoice.created_at)}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {/* <div className="flex justify-end gap-3">
                      <UpdateInvoice id={invoice.id} />
                      <DeleteInvoice id={invoice.id} />
                    </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
