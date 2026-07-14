import { Plus } from 'lucide-react'
import Link from 'next/link'

export function CreateBook() {
  return (
    <Link
      href='/books/create'
      className='flex h-10 items-center rounded-lg bg-blue-600 px-4 font-medium text-sm text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2'
    >
      <span className='hidden md:block'>新建书籍</span>
      <Plus className='h-4 w-4 md:ml-4' />
    </Link>
  )
}
