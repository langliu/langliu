import type { ReactNode } from 'react'
import type { PostFrontMatter } from 'types/PostFrontMatter'
import Comments from '@/components/comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { BlogSEO } from '@/components/SEO'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/libs/utils/formatDate'

interface Props {
  frontMatter: PostFrontMatter
  children: ReactNode
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
}

export default function PostLayout({ frontMatter, next, prev, children }: Props) {
  const { slug, date, title } = frontMatter

  return (
    <SectionContainer>
      <BlogSEO url={`${siteMetadata.siteUrl}/blog/${slug}`} {...frontMatter} />
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className='space-y-1 border-gray-200 border-b pb-10 text-center dark:border-gray-700'>
              <dl>
                <div>
                  <dt className='sr-only'>Published on</dt>
                  <dd className='font-medium text-base text-gray-500 leading-6 dark:text-gray-400'>
                    <time dateTime={date}>{formatDate(date)}</time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className='divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700'
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className='divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700'>
              <div className='prose dark:prose-invert max-w-none pt-10 pb-8'>{children}</div>
            </div>
            <Comments frontMatter={frontMatter} />
            <footer>
              <div className='flex flex-col font-medium text-sm sm:flex-row sm:justify-between sm:text-base'>
                {prev && (
                  <div className='pt-4 xl:pt-8'>
                    <Link
                      href={`/blog/${prev.slug}`}
                      className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && (
                  <div className='pt-4 xl:pt-8'>
                    <Link
                      href={`/blog/${next.slug}`}
                      className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
