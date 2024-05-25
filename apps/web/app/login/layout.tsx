export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='w-screen h-screen flex flex-col justify-center items-center'>{children}</main>
  )
}
