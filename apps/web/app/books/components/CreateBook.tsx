import { PlusOutlined } from '@ant-design/icons'
import Link from 'next/link'

export function CreateBook() {
  return (
    <Link
      href='/books/create'
      className='flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
    >
      <span className='hidden md:block'>新建书籍</span>{' '}
      <PlusOutlined className='md:ml-4' />
    </Link>
  )
}
