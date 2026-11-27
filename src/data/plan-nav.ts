import { Baby, Cloud, Database, Tv } from 'lucide-react'

export const planNavItems = [
  {
    id: 'online',
    title: '在线视频',
    icon: Tv,
  },
  {
    id: 'database',
    title: '影视数据库',
    icon: Database,
  },
  {
    id: 'cloud',
    title: '云盘资源',
    icon: Cloud,
  },
  {
    id: 'korean',
    title: 'Korean BJ',
    icon: Baby,
  },
] as const
