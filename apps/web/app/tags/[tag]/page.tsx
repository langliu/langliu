import React from 'react'
import ArticleItem from '@/components/ArticleItem'
import { getAllFilesFrontMatter } from '@/libs/mdx'

export const getData = async () => {
  const posts = await getAllFilesFrontMatter('blog')
  return { posts }
}

type Props = {
  params: Promise<{
    tag: string
  }>
}
const TagDetailPage = async ({ params }: Props) => {
  const { tag } = await params
  const { posts = [] } = await getData()
  const tagPosts = posts?.filter((post) => post.tags.includes(tag))
  return (
    <div>
      <div className='mt-6 border-gray-300 border-b border-opacity-50 pb-6 font-black text-6xl'>
        {tag.toLocaleUpperCase()} （{posts.length}）
      </div>
      <div>
        <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
          {!posts.length && '无数据'}
          {tagPosts.map((frontMatter) => {
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
    </div>
  )
}

export default TagDetailPage
