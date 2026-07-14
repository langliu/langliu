import Link from 'next/link'
import React from 'react'
import { getAllFilesFrontMatter } from '@/libs/mdx'

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
      <h1 className='mt-8 mb-8 font-black text-6xl'>标签🏷</h1>
      <div className='flex flex-wrap gap-4'>
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
