import { createFileRoute, Link, useLoaderData, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { readingOrder } from '~/lib/novel-utils'

export const Route = createFileRoute('/_auth/read/$novelId/')({
  component: StartPage,
})

function StartPage() {
  const detail = useLoaderData({ from: '/_auth/read/$novelId' })
  const navigate = useNavigate()

  // 上次读到哪记在浏览器里，服务端拿不到，所以挂载后再决定打开哪一章
  useEffect(() => {
    const order = readingOrder(detail)
    if (order.length === 0) {
      return
    }
    const last = localStorage.getItem(`novel:last:${detail.id}`)
    const target = order.find((chapter) => chapter.id === last) ?? order[0]
    navigate({
      to: '/read/$novelId/$chapterId',
      params: { novelId: detail.id, chapterId: target.id },
      replace: true,
    })
  }, [detail, navigate])

  if (detail.chapterCount > 0) {
    return <p className='p-6 text-muted-foreground text-sm'>正在打开…</p>
  }

  return (
    <div className='flex flex-col items-center justify-center gap-3 p-6 py-24 text-center'>
      <p className='font-medium text-sm'>《{detail.name}》还没有章节</p>
      <Button
        size='sm'
        variant='outline'
        render={<Link to='/novels/$novelId' params={{ novelId: detail.id }} />}
      >
        去添加章节
      </Button>
    </div>
  )
}
