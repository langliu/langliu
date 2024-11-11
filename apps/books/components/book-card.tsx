import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'web/components/Link'

interface BookCardProps {
  title: string
  description: string
  id: string
  href: string
}

export function BookCard({ title, description, id, href }: BookCardProps) {
  return (
    <Link href={href}>
      <Card
        className={'hover:-translate-y-0.5 max-w-[1200px] cursor-pointer hover:translate-x-0.5'}
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription className={'line-clamp-2 overflow-hidden text-ellipsis'}>
            {description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
