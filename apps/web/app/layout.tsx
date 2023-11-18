import './global.css'
import StyledComponentsRegistry from '@/libs/AntdRegistry'

export interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='zh-CN'>
      <body className={'antialiased'}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
