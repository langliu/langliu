import HelloWorld from './hello.mdx'
import NewsletterForm from '@/components/NewsletterForm'
// import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getAllPosts } from '@/libs/api'
import { getAllFilesFrontMatter } from '@/libs/mdx'
import formatDate from '@/libs/utils/formatDate'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
// 'use client'
import Link from 'next/link'
import { PostFrontMatter } from 'types/PostFrontMatter'

const MAX_DISPLAY = 5

export const getStaticProps = async () => {
  // const posts = await getAllPosts()
  const posts = await getAllFilesFrontMatter('blog')
  console.log('posts', posts)

  return { posts }
}

export default async function Home() {
  const { posts = [] } = await getStaticProps()
  console.log('posts', posts)
  return (
    <>
      123
      {/* <PageSEO title={siteMetadata.title} description={siteMetadata.description} /> */}
      <div className='divide-y divide-gray-200 dark:divide-gray-700'>
        <div className='space-y-2 pt-6 pb-8 md:space-y-5'>
          <h1 className='text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14'>
            最新の投稿
          </h1>
          <p className='text-lg leading-7 text-gray-500 dark:text-gray-400'>
            {siteMetadata.description}
          </p>
        </div>
        <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, summary, tags } = frontMatter
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
                            <Link
                              href={`/blog/${slug}`}
                              className='text-gray-900 dark:text-gray-100'
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className='flex flex-wrap'>
                            {tags.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className='prose max-w-none text-gray-500 dark:text-gray-400'>
                          {summary}
                        </div>
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
          })}
        </ul>
      </div>
      {posts?.length > MAX_DISPLAY && (
        <div className='flex justify-end text-base font-medium leading-6'>
          <Link
            href='/blog'
            className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
            aria-label='all posts'
          >
            所有文章 &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter.provider !== '' && (
        <div className='flex items-center justify-center pt-4'>
          <NewsletterForm />
        </div>
      )}
      <HelloWorld />
    </>
  )
}
