import { ExternalLink } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Badge } from '~/components/ui/badge'
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
      className='group bg-card ring-foreground/10 hover:bg-muted/50 flex h-full items-start gap-3 rounded-xl p-4 ring-1 transition-colors'
    >
      <ResourceIcon src={icon || `${href}favicon.ico`} />
      <div className='min-w-0 flex-1 space-y-1.5'>
        <div className='flex items-center gap-1.5'>
          <span className='truncate text-sm font-medium'>{title}</span>
          <ExternalLink className='text-muted-foreground size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
        </div>
        {tags.length > 0 ? (
          <div className='flex flex-wrap gap-1.5'>
            {tags.map((tag) => (
              <Badge key={tag} variant='secondary'>
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
        <p className='text-muted-foreground line-clamp-2 text-xs'>{description}</p>
      </div>
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
      width={36}
      height={36}
      loading='lazy'
      decoding='async'
      referrerPolicy='no-referrer'
      className={
        hidden
          ? 'invisible mt-0.5 size-9 shrink-0 rounded-md object-contain'
          : 'bg-muted mt-0.5 size-9 shrink-0 rounded-md object-contain p-1'
      }
      onError={onError}
    />
  )
}
