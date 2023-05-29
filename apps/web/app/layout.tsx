'use client'
import '@/css/prism.css'
import '@/css/tailwind.css'
import 'katex/dist/katex.css'

import '@fontsource/inter'

import Head from 'next/head'

import { ClientReload } from '@/components/ClientReload'
import LayoutWrapper from '@/components/LayoutWrapper'
import Analytics from '@/components/analytics'
import siteMetadata from '@/data/siteMetadata'
import type { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const isDevelopment = process.env.NODE_ENV === 'development'
const isSocket = process.env.SOCKET

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang='zh-CN' className={siteMetadata.theme}>
      <Head>
        <meta content='width=device-width, initial-scale=1' name='viewport' />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <body className='dark:bg-black'>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}

export default RootLayout
