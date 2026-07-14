'use client'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CreateArticle from './CreateArticle'

export function CreateDrawer({ bookId, last }: { bookId: string; last?: number }) {
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
        <Plus className='size-3.5' />
        新建章节
      </SheetTrigger>
      <SheetContent className='w-[540px] sm:w-[500px] sm:max-w-max'>
        <SheetHeader>
          <SheetTitle>新建章节</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
          <CreateArticle bookId={Number(bookId)} last={last} onSuccess={handleSuccess} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
