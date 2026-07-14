'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  const pathname = usePathname()
  const links = [
    {
      text: 'Overview',
      href: '/',
    },
    {
      text: 'Notion',
      href: '/notion',
    },
  ]
  return (
    <div className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <nav className='mx-6 flex items-center space-x-4 lg:space-x-6'>
          {links.map((link) => (
            <Link
              className={clsx('font-medium text-sm transition-colors hover:text-primary', {
                'text-muted-foreground': pathname !== link.href,
              })}
              href={link.href}
              key={link.href}
            >
              {link.text}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
