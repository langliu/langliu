import './global.css'
import Providers from './providers'
import StyledComponentsRegistry from '@/libs/AntdRegistry'
import type { ReactNode } from 'react'

export interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body className={'antialiased'}>
        <Providers>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  )
}
