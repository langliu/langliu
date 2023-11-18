import { type ReactNode } from 'react'

export interface ButtonProps {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export default function Button({ children, type = 'button', onClick }: ButtonProps) {
  return (
    <button
      className='flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
