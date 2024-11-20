import type { ReactNode } from 'react'

export default function AuthorLayout({
  children,
  sheet,
}: {
  children: ReactNode
  sheet: ReactNode
}) {
  return (
    <>
      {children}
      {sheet}
    </>
  )
}
