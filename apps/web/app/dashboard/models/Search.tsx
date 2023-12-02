'use client'
import { SearchOutlined } from '@ant-design/icons'
import { useDebounceFn } from 'ahooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const { run } = useDebounceFn(
    (term: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', '1')
      if (term) {
        params.set('query', term)
      } else {
        params.delete('query')
      }
      console.log('parmas',params.toString());
      replace(`${pathname}?${params.toString()}`)
    },
    {
      wait: 500,
    },
  )

  return (
    <div className='relative flex flex-1 flex-shrink-0'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <input
        className='peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500'
        placeholder={placeholder}
        onChange={(e) => run(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <SearchOutlined className='absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900' />
    </div>
  )
}
