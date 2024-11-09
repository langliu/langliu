import type { Metadata } from 'next'
import localFont from 'next/font/local'
import type { ReactNode } from 'react'
import './globals.css'

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
  title: 'i18n JSON Translate',
  description:
    '18n JSON Translate is a powerful tool designed to help developers and translators manage and translate internationalized (i18n) JSON files more efficiently. With our platform, you can easily import, export, and edit multilingual JSON files, ensuring that your applications or websites can provide a seamless user experience worldwide. Our tool supports multiple languages and offers an intuitive interface and powerful features to simplify the translation process and improve work efficiency.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable}${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
