import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function ResourceCard({
  title,
  description,
  tags,
  href,
}: {
  /** 资源标题 */
  title: string
  description: string
  tags: string[]
  href: string
}) {
  return (
    <Link href={href} target={'_blank'}>
      <Card className={'min-w-52 cursor-pointer hover:bg-gray-50 hover:-translate-y-1'}>
        <CardHeader className={'pb-1.5'}>
          <CardTitle className={'text-xl'}>{title}</CardTitle>
        </CardHeader>
        <CardContent className={'gap-2 flex pb-1.5'}>
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </CardContent>
        <CardFooter>
          <p className={'text-gray-600'}>{description}</p>
        </CardFooter>
      </Card>
    </Link>
  )
}
