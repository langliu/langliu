import { getAuthor } from '@/actions/authors'
import { EditForm } from '@/app/dashboard/authors/[id]/edit-form'
import { NavBreadcrumb } from '@/components/nav-breadcrumb'

export default async function AuthorEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const author = await getAuthor(id)
  const breadcrumbList = [
    {
      title: '书籍管理',
      href: '/dashboard/books',
    },
    {
      title: '作者列表',
      href: '/dashboard/authors',
    },
    {
      title: '编辑作家',
    },
  ]

  return (
    <div>
      <NavBreadcrumb breadcrumbList={breadcrumbList} />
      <div className='px-4'>
        <p className={'text-muted-foreground text-sm'}>
          在文学的世界里，每一个作家都是一位独特的创作者，他们用文字编织出一个个精彩纷呈的故事，触动着读者的心灵。新建作家，就像是在这片广袤的文学天地中播下一颗新的种子，期待它生根发芽，茁壮成长。{' '}
        </p>
        <div className={'mt-4'}>
          <EditForm value={author} />
        </div>
      </div>
    </div>
  )
}
