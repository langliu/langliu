import styles from './page.module.css'
import React, { FC } from 'react'

interface Props {
  children: React.ReactElement
}

const layout: FC<Props> = ({ children }) => {
  return (
    <html lang='zh-CN'>
      <body>
        <div className={styles.wrapper}>{children}</div>
      </body>
    </html>
  )
}

export default layout
