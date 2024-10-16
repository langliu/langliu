import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: '影视导航',
  description:
    '影视导航致力于以丰富的内容、优良的观看体验要满足用户在线观看视频的需求，本站提供又新又热的电影、电视剧、动漫、综艺、游戏、娱乐视频在线观看综合影视尽在影视导航。',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='zh'>
      <body className={`${geistSans.variable}${geistMono.variable}`}>{children}</body>
    </html>
  )
}
