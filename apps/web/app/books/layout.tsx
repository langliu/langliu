import Head from 'next/head'
import React, { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const BooksLayout: FC<Props> = ({ children }) => {
  return (
    <html lang='zh-CN'>
      <Head>
        <meta content='width=device-width, initial-scale=1' name='viewport' />
      </Head>
      <body>{children}</body>
    </html>
  )
}

export default BooksLayout
