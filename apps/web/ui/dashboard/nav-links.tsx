'use client'
import { FilePptOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeOutlined },
  {
    name: '专辑管理',
    href: '/dashboard/albums',
    icon: FilePptOutlined,
  },
  {
    name: '模特管理',
    href: '/dashboard/models',
    icon: UserOutlined,
  },
  {
    name: '机构管理',
    href: '/dashboard/organizations',
    icon: UserOutlined,
  },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        )
      })}
    </>
  )
}
