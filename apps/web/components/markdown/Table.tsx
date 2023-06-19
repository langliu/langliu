'use client'
import styles from './Table.module.css'
import type { FC, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

const Pre: FC<Props> = ({ children }) => {
  return <table className={styles.wrapper}>{children}</table>
}

export default Pre
