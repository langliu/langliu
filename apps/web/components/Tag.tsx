import kebabCase from '@/libs/utils/kebabCase'
import Link from 'next/link'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      className='mr-3 text-sm font-medium uppercase text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
      href={`/tags/${kebabCase(text)}`}
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
