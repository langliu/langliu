'use client'
import { useDebounceFn } from 'ahooks'
import { Pagination, type PaginationProps } from 'antd'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function Page(props: PaginationProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const { run } = useDebounceFn(
    (page: number) => {
      const params = new URLSearchParams(searchParams)
      params.set('page', page.toString())
      replace(`${pathname}?${params.toString()}`)
    },
    {
      wait: 100,
    },
  )
  return (
    <Pagination
      total={props.total ?? 0}
      {...props}
      onChange={(page) => run(page)}
      showTotal={(total) => `共 ${total} 条`}
      showSizeChanger={false}
    />
  )
}
