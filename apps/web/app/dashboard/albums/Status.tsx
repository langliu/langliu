import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline'
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
          <CheckIcon className='ml-1 w-4 text-white' />
        </>
      ) : (
        <>
          未收集
          <ClockIcon className='ml-1 w-4 text-gray-500' />
        </>
      )}
    </span>
  )
}
