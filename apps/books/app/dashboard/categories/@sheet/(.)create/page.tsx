'use client'
import { createCategory } from '@/actions/categories'
import CategoryForm from '@/app/dashboard/categories/category-form'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import type { Category } from '@prisma/client'
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

  function handleSubmit(author: Pick<Category, 'name'>) {
    createCategory(author)
      .then(() => {
        toast({
          title: '创建成功',
          description: '创建标签成功',
        })
        handleOpenChange(false)
      })
      .catch((e) => {
        toast({
          title: '创建失败',
          description: e.message || '创建标签失败',
          variant: 'destructive',
        })
      })
  }

  return (
    <Sheet open onOpenChange={handleOpenChange}>
      <SheetContent className={clsx('flex w-[520px] flex-col overflow-y-auto sm:max-w-full')}>
        <SheetHeader>
          <SheetTitle>新建标签</SheetTitle>
          <SheetDescription>
            书籍标签是对浩瀚书海进行分类梳理的智慧密码。它像是一把把精致的钥匙，能够开启特定主题、风格或知识领域的书籍宝库大门。无论是标记经典名著的不朽魅力，还是区分热门畅销书中的多元题材，亦或是归类小众冷门书籍的独特韵味，书籍标签都精准地发挥着作用。
          </SheetDescription>
        </SheetHeader>
        <CategoryForm onSubmit={handleSubmit} />
      </SheetContent>
    </Sheet>
  )
}
