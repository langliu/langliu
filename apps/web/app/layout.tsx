import './global.css'
import type { ReactNode } from 'react'
import StyledComponentsRegistry from '@/libs/AntdRegistry'
import Providers from './providers'

export interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='zh-CN'>
      <body className={'antialiased'}>
        <Providers>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  )
}
