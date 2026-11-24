import { useEffect, useRef, useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { sendGTMEvent } from '~/lib/analytics'

type IconStage = 'proxy' | 'direct' | 'failed'

const nextStage = (stage: IconStage): IconStage => (stage === 'proxy' ? 'direct' : 'failed')

export function ResourceCard({
  title,
  description,
  tags,
  href,
  icon,
}: {
  /** 资源标题 */
  title: string
  description: string
  tags: string[]
  href: string
  icon?: string
}) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noreferrer'
      onClick={() => sendGTMEvent({ event: 'link_click', value: href })}
    >
      <Card className='flex h-full min-w-52 cursor-pointer items-center hover:-translate-y-1 hover:bg-gray-50'>
        <ResourceIcon src={icon || `${href}favicon.ico`} />
        <div>
          <CardHeader className='pt-4 pb-1.5'>
            <CardTitle className='text-xl'>{title}</CardTitle>
          </CardHeader>
          <CardContent className='flex gap-2 pb-1.5'>
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </CardContent>
          <CardFooter className='pb-4'>
            <p className='text-gray-600'>{description}</p>
          </CardFooter>
        </div>
      </Card>
    </a>
  )
}

/** 图标先经 Worker 代取（对应原来 next/image 的服务端取图），代取失败再让浏览器直连。 */
function ResourceIcon({ src }: { src: string }) {
  const [stage, setStage] = useState<IconStage>('proxy')

  return (
    <IconImage
      key={stage}
      src={stage === 'direct' ? src : `/icon?src=${encodeURIComponent(src)}`}
      hidden={stage === 'failed'}
      onError={() => setStage(nextStage(stage))}
    />
  )
}

function IconImage({
  src,
  hidden,
  onError,
}: {
  src: string
  hidden: boolean
  onError: () => void
}) {
  const ref = useRef<HTMLImageElement>(null)

  // 图片可能在 hydration 之前就已加载失败，那时 onError 还没挂上，所以挂载后再检查一次
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth === 0) {
      onError()
    }
  }, [onError])

  return (
    <img
      ref={ref}
      src={src}
      alt=''
      width={50}
      height={50}
      loading='lazy'
      decoding='async'
      referrerPolicy='no-referrer'
      className={hidden ? 'invisible pl-4' : 'pl-4'}
      onError={onError}
    />
  )
}
