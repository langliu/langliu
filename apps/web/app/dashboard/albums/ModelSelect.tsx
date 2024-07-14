'use client'

import type { Database } from '@/types/supabase'
import { useDebounceFn } from 'ahooks'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button, Select } from 'antd'
import { X } from 'lucide-react'

export default function ModelSelect({
  models = [],
}: { models: Database['public']['Tables']['models']['Row'][] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const query = searchParams.get('query') || ''
  const modelId = searchParams.get('model')
  const { run: handleSearch } = useDebounceFn(
    (modelId: string) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', '1')
      if (modelId) {
        params.set('model', modelId)
      } else {
        params.delete('model')
      }
      replace(`${pathname}?${params.toString()}`)
    },
    {
      wait: 100,
    },
  )

  const handleReset = () => {
    console.log('handleReset')
    replace(pathname)
  }

  return (
    <>
      <Select
        optionFilterProp="label"
        options={models.map((model) => ({ label: model.username, value: model.id }))}
        placeholder={'选择模特'}
        className="w-[180px]"
        onChange={handleSearch}
        size="large"
      />
      {(!!query || !!modelId) && (
        <Button ghost onClick={handleReset} icon={<X className="size-3.5" />}>
          重置
        </Button>
      )}
    </>
  )
}
