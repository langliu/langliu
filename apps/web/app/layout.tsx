import './global.css'
import { Toaster } from '@langliu/ui/ui/toast'
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
          <StyledComponentsRegistry>
            {children}
            <Toaster />
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  )
}
