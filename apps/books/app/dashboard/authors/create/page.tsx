'use client'
import { createAuthor } from '@/actions/authors'
import AuthorForm from '@/app/dashboard/authors/author-form'
import { NavBreadcrumb } from '@/components/nav-breadcrumb'
import { useToast } from '@/hooks/use-toast'
import type { Author } from '@prisma/client'
import { useRouter } from 'next/navigation'

export default function DashboardBookCreatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const breadcrumbList = [
    {
      title: '书籍管理',
      href: '/dashboard/books',
    },
    {
      title: '作者列表',
      href: '/dashboard/books',
    },
    {
      title: '创建作家',
    },
  ]

  function handleSubmit(author: Pick<Author, 'name' | 'email'>) {
    createAuthor(author)
      .then(() => {
        toast({
          title: '创建成功',
          description: '创建作家成功',
        })
        router.back()
      })
      .catch((e) => {
        toast({
          title: '创建失败',
          description: e?.message || '创建作家失败',
          variant: 'destructive',
        })
      })
  }

  return (
    <div>
      <NavBreadcrumb breadcrumbList={breadcrumbList} />
      <div className='px-4'>
        <p className={'text-muted-foreground text-sm'}>
          在文学的世界里，每一个作家都是一位独特的创作者，他们用文字编织出一个个精彩纷呈的故事，触动着读者的心灵。新建作家，就像是在这片广袤的文学天地中播下一颗新的种子，期待它生根发芽，茁壮成长。{' '}
        </p>
        <div className={'mt-4'}>
          <AuthorForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
