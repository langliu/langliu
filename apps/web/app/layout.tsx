import './global.css'
import Head from 'next/head'

export const metadata = {
  title: '研之有物',
  description: '刘浪的个人站',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <Head>
        <title>Welcome to web!</title>
      </Head>
      <body>{children}</body>
    </html>
  )
}
