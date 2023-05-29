import { FC, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}
const InlineCode: FC<Props> = ({ children }) => {
  return <code className='px-1 py-0.5 rounded-sm text-pink-500'>{children}</code>
}

export default InlineCode
