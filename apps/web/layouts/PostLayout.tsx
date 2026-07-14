import type { ReactNode } from 'react'
import type { AuthorFrontMatter } from 'types/AuthorFrontMatter'
import type { PostFrontMatter } from 'types/PostFrontMatter'
import Comments from '@/components/comments'
import Image from '@/components/Image'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { BlogSEO } from '@/components/SEO'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

const editUrl = (fileName: string) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`
const discussUrl = (slug: string) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`,
  )}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface Props {
  frontMatter: PostFrontMatter
  authorDetails: AuthorFrontMatter[]
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
  children: ReactNode
}

export default function PostLayout({ frontMatter, authorDetails, next, prev, children }: Props) {
  const { slug, fileName, date, title, tags } = frontMatter

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article>
        <div className='xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700'>
          <header className='pt-6 xl:pb-6'>
            <div className='space-y-1 text-center'>
              <dl className='space-y-10'>
                <div>
                  <dt className='sr-only'>Published on</dt>
                  <dd className='font-medium text-base text-gray-500 leading-6 dark:text-gray-400'>
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className='divide-y divide-gray-200 pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0 dark:divide-gray-700'
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <dl className='pt-6 pb-10 xl:border-gray-200 xl:border-b xl:pt-11 xl:dark:border-gray-700'>
              <dt className='sr-only'>Authors</dt>
              <dd>
                <ul className='flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8'>
                  {authorDetails.map((author) => (
                    <li className='flex items-center space-x-2' key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt='avatar'
                          className='h-10 w-10 rounded-full'
                        />
                      )}
                      <dl className='whitespace-nowrap font-medium text-sm leading-5'>
                        <dt className='sr-only'>Name</dt>
                        <dd className='text-gray-900 dark:text-gray-100'>{author.name}</dd>
                        <dt className='sr-only'>Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                            >
                              {author.twitter.replace('https://twitter.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className='divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700'>
              <div className='prose dark:prose-invert max-w-none pt-10 pb-8'>{children}</div>
              <div className='pt-6 pb-6 text-gray-700 text-sm dark:text-gray-300'>
                <Link href={discussUrl(slug)} rel='nofollow'>
                  {'Discuss on Twitter'}
                </Link>
                {' • '}
                <Link href={editUrl(fileName)}>{'View on GitHub'}</Link>
              </div>
              <Comments frontMatter={frontMatter} />
            </div>
            <footer>
              <div className='divide-gray-200 font-medium text-sm leading-5 xl:col-start-1 xl:row-start-2 xl:divide-y dark:divide-gray-700'>
                {tags && (
                  <div className='py-4 xl:py-8'>
                    <h2 className='text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400'>
                      Tags
                    </h2>
                    <div className='flex flex-wrap'>
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className='flex justify-between py-4 xl:block xl:space-y-8 xl:py-8'>
                    {prev && (
                      <div>
                        <h2 className='text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400'>
                          上一篇
                        </h2>
                        <div className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'>
                          <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className='text-gray-500 text-xs uppercase tracking-wide dark:text-gray-400'>
                          下一篇
                        </h2>
                        <div className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'>
                          <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className='pt-4 xl:pt-8'>
                <Link
                  href='/blog'
                  className='text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
