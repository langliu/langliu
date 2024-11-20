'use client'

import { updateAuthor } from '@/actions/authors'
import AuthorForm from '@/app/dashboard/authors/author-form'
import { useToast } from '@/hooks/use-toast'
import type { Author, Category } from '@prisma/client'
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
    updateAuthor(value?.id, author)
      .then(() => {
        toast({
          title: '编辑成功',
          description: '编辑作家成功',
        })
        router.back()
      })
      .catch((e) => {
        toast({
          title: '编辑失败',
          description: e?.message || '编辑作家失败',
          variant: 'destructive',
        })
      })
  }

  return <AuthorForm onSubmit={handleSubmit} values={value} />
}