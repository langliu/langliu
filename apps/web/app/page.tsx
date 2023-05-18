import ArticleItem from '@/components/ArticleItem'
import NewsletterForm from '@/components/NewsletterForm'
import siteMetadata from '@/data/siteMetadata'
import { getAllFilesFrontMatter } from '@/libs/mdx'
import Link from 'next/link'

const MAX_DISPLAY = 5

export const getData = async () => {
  const posts = await getAllFilesFrontMatter('blog')
  console.log('posts', posts)

  return { posts }
}

export default async function Home() {
  const { posts = [] } = await getData()
  console.log('posts', posts)
  return (
    <>
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
    </>
  )
}
