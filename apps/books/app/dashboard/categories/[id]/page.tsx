import { getCategoriesById } from '@/actions/categories'
import { EditForm } from '@/app/dashboard/categories/[id]/edit-form'
import { NavBreadcrumb } from '@/components/nav-breadcrumb'

export default async function AuthorEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const id = (await params).id
  const category = await getCategoriesById(id)
  const breadcrumbList = [
    {
      title: '书籍管理',
      href: '/dashboard/books',
    },
    {
      title: '标签管理',
      href: '/dashboard/categories',
    },
    {
      title: '编辑标签',
    },
  ]

  return (
    <div>
      <NavBreadcrumb breadcrumbList={breadcrumbList} />
      <div className='px-4'>
        <p className={'text-muted-foreground text-sm'}>
          书籍标签是对浩瀚书海进行分类梳理的智慧密码。它像是一把把精致的钥匙，能够开启特定主题、风格或知识领域的书籍宝库大门。无论是标记经典名著的不朽魅力，还是区分热门畅销书中的多元题材，亦或是归类小众冷门书籍的独特韵味，书籍标签都精准地发挥着作用。
        </p>
        <div className={'mt-4'}>
          <EditForm value={category} />
        </div>
      </div>
    </div>
  )
}
