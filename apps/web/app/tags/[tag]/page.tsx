import ArticleItem from '@/components/ArticleItem'
import { getAllFilesFrontMatter } from '@/libs/mdx'
import React from 'react'

export const getData = async () => {
  const posts = await getAllFilesFrontMatter('blog')
  return { posts }
}

type Props = {
  params: {
    tag: string
  }
}
export const runtime = 'edge'
const TagDetailPage = async ({ params }: Props) => {
  const { posts = [] } = await getData()
  const tagPosts = posts?.filter((post) => post.tags.includes(params.tag))
  return (
    <div>
      <div className='text-6xl font-black mt-6 pb-6 border-b border-gray-300 border-opacity-50'>
        {params.tag.toLocaleUpperCase()} （{posts.length}）
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
