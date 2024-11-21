import { BookCard } from '@/components/book-card'
import prisma from '@/lib/prisma'

async function getBooks() {
  const books = await prisma.book.findMany()

  return {
    books,
  }
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { books } = await getBooks()
  return (
    <div className='min-h-screen gap-16 p-4 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-8'>
      <main className='flex flex-col items-start gap-4'>
        <h1 className='font-bold text-2xl'>万卷书阁</h1>
        <div className={'grid grid-cols-1 gap-3'}>
          {books.map((book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </div>
      </main>
    </div>
  )
}
