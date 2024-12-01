'use client'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { sendGTMEvent } from '@next/third-parties/google'
import Image from 'next/image'
import Link from 'next/link'

export default function ResourceCard({
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
    <Link
      href={href}
      target={'_blank'}
      onClick={() => sendGTMEvent({ event: 'link_click', value: href })}
    >
      <Card
        className={
          'hover:-translate-y-1 flex h-full min-w-52 cursor-pointer items-center hover:bg-gray-50'
        }
      >
        <Image
          src={icon || `${href}favicon.ico`}
          alt={'favicon'}
          width={50}
          height={50}
          className={'pl-4'}
        />
        <div>
          <CardHeader className={'pt-4 pb-1.5'}>
            <CardTitle className={'text-xl'}>{title}</CardTitle>
          </CardHeader>
          <CardContent className={'flex gap-2 pb-1.5'}>
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </CardContent>
          <CardFooter className={'pb-4'}>
            <p className={'text-gray-600'}>{description}</p>
          </CardFooter>
        </div>
      </Card>
    </Link>
  )
}
