import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BookCardProps {
  title: string
  description: string
}

export function BookCard({ title, description }: BookCardProps) {
  return (
    <Card className={'hover:-translate-y-0.5 max-w-[1200px] cursor-pointer hover:translate-x-0.5'}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription className={'line-clamp-2 overflow-hidden text-ellipsis'}>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
