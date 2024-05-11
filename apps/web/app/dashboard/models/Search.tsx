'use client'
import { Input } from '@/components/ui/input'
import { useDebounceFn } from 'ahooks'
import { Search as SearchIcon } from 'lucide-react'
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
      console.log('parmas', params.toString())
      replace(`${pathname}?${params.toString()}`)
    },
    {
      wait: 500,
    },
  )

  return (
    <div className="relative flex-1 flex-shrink-0">
      <Input
        placeholder={placeholder}
        onChange={(e) => run(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()}
        className="pl-8"
      />
      <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  )
}
