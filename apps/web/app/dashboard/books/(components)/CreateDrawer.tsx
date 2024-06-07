'use client'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CreateBook from './CreateBook'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

export function CreateDrawer() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSuccess = () => {
    setOpen(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={buttonVariants({
          className: 'ml-auto gap-1.5',
          size: 'sm',
          variant: 'outline',
        })}
      >
        <Plus className="size-3.5" />
        新建书籍
      </SheetTrigger>
      <SheetContent className="w-[540px] sm:w-[500px] sm:max-w-7xl md:w-[680px]">
        <SheetHeader>
          <SheetTitle>新建书籍</SheetTitle>
          <SheetDescription>请填写书籍相关信息</SheetDescription>
          <CreateBook onSuccess={handleSuccess} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
