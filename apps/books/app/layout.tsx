import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import type { ReactNode } from 'react'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: '万卷书阁',
  description:
    '万卷书阁,最新热门小说网站，提供玄幻小说、武侠小说、原创小说、网游小说、都市小说、言情小说、青春小说、科幻小说等,最新章节在线阅读。更多精彩尽在万卷书阁。',
  keywords: ['最新小说', '最新章节', '小说', '小说网', '小说网站', '热门小说', '小说在线阅读'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='zh'>
      <body className={`${geistSans.variable}${geistMono.variable} antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
