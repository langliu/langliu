import Link from 'next/link'
import ArticleItem from '@/components/ArticleItem'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/libs/mdx'

const MAX_DISPLAY = 5

type Props = {
  params: Promise<{
    page: string
  }>
}

export const getData = async () => {
  const posts = await getAllFilesFrontMatter('blog')
  return { posts }
}

export default async function Home({ params }: Props) {
  const { page } = await params
  const { posts = [] } = await getData()
  const totalPage = Math.max(1, Math.ceil(posts.length / MAX_DISPLAY))
  const currentPage = Number.parseInt(page, 10)

  return (
    <>
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='font-extrabold text-3xl text-gray-900 leading-9 tracking-tight sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100'>
            所有文章
          </h1>
          <p className='text-gray-500 text-lg leading-7 dark:text-gray-400'>
            {siteMetadata.description}
          </p>
        </div>
        <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
          {!posts.length && 'No posts found.'}
          {posts
            .slice((currentPage - 1) * MAX_DISPLAY, MAX_DISPLAY * currentPage)
            .map((frontMatter) => {
              const { slug, date, title, summary, tags } = frontMatter
              return (
                <ArticleItem
                  key={slug}
                  slug={slug}
                  title={title}
                  tags={tags}
                  date={date}
                  summary={summary}
                />
              )
            })}
        </ul>
      </div>
      {posts?.length > MAX_DISPLAY && (
        <div className='flex justify-between font-medium text-base leading-6'>
          {currentPage > 1 ? (
            <Link href={`/blog/page/${currentPage - 1}`} title='上一页'>
              上一页
            </Link>
          ) : (
            <span className='cursor-not-allowed text-gray-400'>上一页</span>
          )}
          <span>
            {currentPage} / {totalPage}
          </span>
          {currentPage < totalPage ? (
            <Link href={`/blog/page/${currentPage + 1}`} className='' title='下一页'>
              下一页
            </Link>
          ) : (
            <span className='cursor-not-allowed text-gray-400'>下一页</span>
          )}
        </div>
      )}
    </>
  )
}
