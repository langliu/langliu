'use client'
import Link from 'next/link'
import clsx from 'clsx'
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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {links.map((link) => (
            <Link
              className={clsx('text-sm font-medium transition-colors hover:text-primary', {
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
