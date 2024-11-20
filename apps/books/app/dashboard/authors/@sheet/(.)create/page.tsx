'use client'
import { createAuthor } from '@/actions/authors'
import AuthorForm from '@/app/dashboard/authors/author-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import type { Author } from '@prisma/client'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'

export default function EditSheet() {
  const router = useRouter()
  const { toast } = useToast()

  function handleOpenChange(open: boolean) {
    if (!open) {
      router.back()
    }
  }

  function handleSubmit(author: Pick<Author, 'name' | 'email'>) {
    createAuthor(author)
      .then(() => {
        toast({
          title: '创建成功',
          description: '创建作家成功',
        })
        handleOpenChange(false)
      })
      .catch((e) => {
        toast({
          title: '创建失败',
          description: e.message || '创建作家失败',
          variant: 'destructive',
        })
      })
  }

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetContent className={clsx('flex w-[520px] flex-col overflow-y-auto sm:max-w-full')}>
        <SheetHeader>
          <SheetTitle>新建作家</SheetTitle>
          <SheetDescription>
            在文学的世界里，每一个作家都是一位独特的创作者，他们用文字编织出一个个精彩纷呈的故事，触动着读者的心灵。新建作家，就像是在这片广袤的文学天地中播下一颗新的种子，期待它生根发芽，茁壮成长。{' '}
          </SheetDescription>
        </SheetHeader>
        <AuthorForm onSubmit={handleSubmit} />
      </SheetContent>
    </Sheet>
  )
}
