import { Nav } from '@/components/nav'
import { Archive, ArchiveX, Home, Send, Users, Book } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function NavLinks({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname()
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
          title: '书籍管理',
          label: '',
          icon: Book,
          variant: pathname.startsWith('/dashboard/books') ? 'default' : 'ghost',
          href: '/dashboard/books',
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
