import Tag from '../Tag'
import formatDate from '@/libs/utils/formatDate'
import Link from 'next/link'
import React, { FC } from 'react'

type Props = {
  date: string
  slug: string
  title: string
  tags: string[]
  summary?: string
}

const ArticleItem: FC<Props> = ({ date, slug, title, tags, summary }) => {
  return (
    <li key={slug} className='py-12'>
      <article>
        <div className='space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0'>
          <dl>
            <dt className='sr-only'>Published on</dt>
            <dd className='text-base font-medium leading-6 text-gray-500 dark:text-gray-400'>
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
          <div className='space-y-5 xl:col-span-3'>
            <div className='space-y-6'>
              <div>
                <h2 className='text-2xl font-bold leading-8 tracking-tight'>
                  <Link href={`/blog/${slug}`} className='text-gray-900 dark:text-gray-100'>
                    {title}
                  </Link>
                </h2>
                <div className='flex flex-wrap'>
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </div>
              </div>
              <div className='prose max-w-none text-gray-500 dark:text-gray-400'>{summary}</div>
            </div>
            <div className='text-base font-medium leading-6'>
              <Link
                href={`/blog/${slug}`}
                className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                aria-label={`Read "${title}"`}
              >
                查看详情 &rarr;
              </Link>
            </div>
          </div>
        </div>
      </article>
    </li>
  )
}

export default ArticleItem
