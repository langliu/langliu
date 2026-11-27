import { BookOpen } from 'lucide-react'
import { useState } from 'react'

import { cn } from '~/lib/utils'

export function NovelCover({
  src,
  name,
  className,
}: {
  src: string | null
  name: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  // 没填封面或图片挂了，就占一个同样大小的位置，列表不会跟着跳动
  if (!src || failed) {
    return (
      <div
        className={cn(
          'flex aspect-3/4 items-center justify-center rounded-lg bg-muted text-muted-foreground',
          className,
        )}
      >
        <BookOpen className='size-1/4' />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${name}的封面`}
      referrerPolicy='no-referrer'
      onError={() => setFailed(true)}
      className={cn('aspect-3/4 rounded-lg bg-muted object-cover', className)}
    />
  )
}
