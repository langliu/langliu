'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Database } from '@/types/supabase'
import { useDebounceFn } from 'ahooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function ModelSelect({
  models = [],
}: { models: Database['public']['Tables']['models']['Row'][] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const { run: handleSearch } = useDebounceFn(
    (term: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', '1')
      if (term) {
        params.set('model', term)
      } else {
        params.delete('model')
      }
      replace(`${pathname}?${params.toString()}`)
    },
    {
      wait: 100,
    },
  )

  return (
    <Select onValueChange={handleSearch} defaultValue={searchParams.get('model')?.toString()}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择模特" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {models.map((model) => (
            <SelectItem value={model.id.toString()} key={model.id}>
              {model.username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
