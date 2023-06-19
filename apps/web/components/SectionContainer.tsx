import type { FC, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const SectionContainer: FC<Props> = ({ children }) => {
  return (
    <div className='mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 dark:text-white text-black'>
      {children}
    </div>
  )
}

export default SectionContainer
