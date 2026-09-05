import { Separator } from '@langliu/ui/ui/separator'
import type { FC, ReactNode } from 'react'

export type DashboardHeaderProps = {
  children?: ReactNode
  extra?: ReactNode
  title: ReactNode
}

export const DashboardHeader: FC<DashboardHeaderProps> = ({ extra, title }) => {
  return (
    <div>
      <header className='sticky top-0 z-10 flex h-[52px] items-center justify-between gap-1 bg-background px-4'>
        <h1 className='font-semibold text-lg'>{title}</h1>
        {extra}
      </header>
      <Separator />
    </div>
  )
}

export default DashboardHeader
