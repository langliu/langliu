'use client'
import { Button } from '@/components/ui/button'
import { useDebounceFn } from 'ahooks'
import { Search as SearchIcon } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function NextButton({ nextCursor }: { nextCursor?: string | null }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const { run } = useDebounceFn(
    () => {
      const params = new URLSearchParams(searchParams)
      if (nextCursor) {
        params.set('nextCursor', nextCursor)
      } else {
        params.delete('nextCursor')
      }
      replace(`${pathname}?${params.toString()}`)
    },
    {
      wait: 500,
    },
  )

  return (
    <Button onClick={run} className="mt-4 gap-1.5" variant={'outline'}>
      <SearchIcon className="size-3.5" />
      下一页
    </Button>
  )
}
