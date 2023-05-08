import styles from './page.module.css'
import React, { FC } from 'react'

type Props = {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return <div className={styles.page}>{children}</div>
}

export default Layout
