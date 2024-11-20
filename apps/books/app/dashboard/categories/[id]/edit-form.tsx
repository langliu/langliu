'use client'

import { updateCategory } from '@/actions/categories'
import CategoryForm from '@/app/dashboard/categories/category-form'
import { useToast } from '@/hooks/use-toast'
import type { Category } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface EditFormProps {
  value: Category | null
}

export function EditForm({ value }: EditFormProps) {
  const router = useRouter()
  const { toast } = useToast()

  function handleSubmit(author: Pick<Category, 'name'>) {
    if (!value) {
      return
    }
    updateCategory(value?.id, author)
      .then(() => {
        toast({
          title: '编辑成功',
          description: '编辑标签成功',
        })
        router.back()
      })
      .catch((e) => {
        toast({
          title: '编辑失败',
          description: e?.message || '编辑标签失败',
          variant: 'destructive',
        })
      })
  }

  return <CategoryForm onSubmit={handleSubmit} values={value} />
}
