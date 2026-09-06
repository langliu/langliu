import './global.css'
import { Toaster } from '@langliu/ui/ui/toast'
import type { ReactNode } from 'react'
import StyledComponentsRegistry from '@/libs/AntdRegistry'

export interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='zh-CN'>
      <body className='antialiased'>
        <StyledComponentsRegistry>
          {children}
          <Toaster />
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
