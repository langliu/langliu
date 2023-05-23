import { getAllFilesFrontMatter } from '@/libs/mdx'
import Link from 'next/link'
import React from 'react'

export const runtime = 'edge'

export const getData = async () => {
  const posts = await getAllFilesFrontMatter('blog')
  return { tags: posts.map((item) => item.tags) }
}

const TagsPage = async () => {
  const { tags } = await getData()
  const allTags = tags.flat()
  const tagCount: Record<string, number> = {}
  allTags.forEach((item) => {
    if (tagCount?.[item]) {
      tagCount[item] += 1
    } else {
      tagCount[item] = 1
    }
  })

  return (
    <div>
      <h1 className='text-6xl font-black mt-8 mb-8'>标签🏷</h1>
      <div className='flex gap-4 flex-wrap'>
        {Object.entries(tagCount).map(([tag, count]) => (
          <Link href={`/tags/${tag}`} key={tag} className='inline-block'>
            <span className='text-primary-400'>{tag.toLocaleUpperCase()}</span>
            <span>（{count}）</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TagsPage
