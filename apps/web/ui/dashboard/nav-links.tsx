'use client'
import { Nav } from '@/components/nav'
import {
  Archive,
  ArchiveX,
  File,
  Home,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function NavLinks() {
  const pathname = usePathname()
  console.log(pathname)
  const [isCollapsed, setIsCollapsed] = useState(false)
  return (
    <Nav
      isCollapsed={isCollapsed}
      links={[
        {
          title: '首页',
          label: '128',
          icon: Home,
          variant: pathname === '/dashboard' ? 'default' : 'ghost',
          href: '/dashboard',
        },
        {
          title: '模特管理',
          label: '9',
          icon: Users,
          variant: pathname.startsWith('/dashboard/models') ? 'default' : 'ghost',
          href: '/dashboard/models',
        },
        {
          title: '专辑管理',
          label: '',
          icon: Send,
          variant: pathname.startsWith('/dashboard/albums') ? 'default' : 'ghost',
          href: '/dashboard/albums',
        },
        {
          title: '机构管理',
          label: '23',
          icon: ArchiveX,
          variant: pathname.startsWith('/dashboard/organizations') ? 'default' : 'ghost',
          href: '/dashboard/organizations',
        },
        {
          title: 'Trash',
          label: '',
          icon: Trash2,
          variant: 'ghost',
        },
        {
          title: 'Archive',
          label: '',
          icon: Archive,
          variant: 'ghost',
        },
      ]}
    />
  )
}
