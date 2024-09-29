'use client'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import './index.css'

const button = cva('harmony-button', {
  variants: {
    variant: {
      normal: 'harmony-button__normal',
      emphasized: 'harmony-button__emphasized',
      warning: 'harmony-button__warning',
      text: 'harmony-button__text',
      selected: 'harmony-button__selected',
      unselected: 'harmony-button__unselected',
    },
    shadow: {
      true: 'harmony-button__shadow',
    },
    size: {
      small: 'harmony-button__small',
      medium: '',
    },
  },
  defaultVariants: {
    /** 按钮类型 */
    variant: 'normal',
    shadow: false,
    size: 'medium',
  },
})

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> &
  PropsWithChildren<{
    /** 按钮类型 */
    variant?: 'normal' | 'emphasized' | 'warning' | 'text' | 'selected' | 'unselected'
    /** 自定义类名 */
    className?: string
    /** 是否展示外阴影 */
    shadow?: boolean
  }>

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'normal',
  shadow = false,
  className,
  ...props
}) => {
  return (
    <button className={button({ className, variant, shadow })} {...props}>
      {children}
    </button>
  )
}
