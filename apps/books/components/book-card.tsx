import type { Book } from '@prisma/client'
import Image from 'next/image'
import Link from 'web/components/Link'

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`} className={'flex gap-3'}>
      {book.cover && (
        <Image alt={book.title} src={book.cover} width={90} height={160} className={'rounded'} />
      )}
      <div className={'flex-1'}>
        <h3 className={'mb-3 font-medium text-base'}>{book.title}</h3>
        <p className={'line-clamp-2 overflow-hidden text-ellipsis text-muted-foreground text-sm'}>
          {book.introduction}
        </p>
      </div>
    </Link>
  )
}
