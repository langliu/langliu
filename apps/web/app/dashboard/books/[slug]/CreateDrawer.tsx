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
import CreateArticle from './CreateArticle'
import { useState } from 'react'

import { Plus } from 'lucide-react'

export function CreateDrawer({ bookId }: { bookId: string }) {
  const [open, setOpen] = useState(false)

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
        新建章节
      </SheetTrigger>
      <SheetContent className="w-[540px] sm:w-[500px] sm:max-w-max">
        <SheetHeader>
          <SheetTitle>新建章节</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </SheetDescription>
          <CreateArticle bookId={Number(bookId)} onSuccess={() => setOpen(false)} />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
