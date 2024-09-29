'use client'

import type { FC, PropsWithChildren } from 'react'
import './index.css'

export type ButtonProps = PropsWithChildren<{
  htmlType?: 'button' | 'submit' | 'reset'
  type?: 'emphasized' | 'normal'
}>

export const Button: FC<ButtonProps> = ({ children, htmlType = 'button', type = 'normal' }) => {
  return (
    <button type={htmlType} onClick={() => alert('boop')} className={'button'}>
      {children}
    </button>
  )
}
