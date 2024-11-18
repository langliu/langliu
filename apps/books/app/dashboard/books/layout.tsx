import type { ReactNode } from 'react'

export default function RootLayout({
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
      <div id='modal-root' />
    </>
  )
}
