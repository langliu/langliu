import './global.css'

export interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='zh-CN'>
      <body className={'antialiased'}>{children}</body>
    </html>
  )
}
