import { Check, Clock } from 'lucide-react'
import clsx from 'clsx'

export default function InvoiceStatus({ status }: { status: boolean }) {
  return (
    <span
      className={clsx('inline-flex items-center rounded-full px-2 py-1 text-xs', {
        'bg-gray-100 text-gray-500': !status,
        'bg-green-500 text-white': status,
      })}
    >
      {status ? (
        <>
          已收集
          <Check className="ml-1 w-4 text-white" />
        </>
      ) : (
        <>
          未收集
          <Clock className="ml-1 w-4 text-gray-500" />
        </>
      )}
    </span>
  )
}
