import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: '新建章节',
}

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return children
}
