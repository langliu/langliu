import Link from 'next/link'

interface Props {
  text: string
}

export default function Tag({ text }: Props) {
  const formatted = text.split(' ').join('-').toLowerCase()
  return (
    <Link
      href={`/tags/${formatted}`}
      className='mr-3 font-medium text-primary-500 text-sm uppercase hover:text-primary-600 dark:hover:text-primary-400'
    >
      {text.split(' ').join('-')}
    </Link>
  )
}
