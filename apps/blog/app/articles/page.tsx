import SearchArticles from './SearchArticles'
import SimpleLayout from 'components/SimpleLayout'
import { server } from 'config'
import { Article, allArticles } from 'contentlayer/generated'
import type { Metadata } from 'next'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Articles',
  description:
    'All my articles are written with the goal of helping you learn something new. I hope you enjoy them!',

  // Open Graph
  openGraph: {
    title: 'Articles - 研之有物',
    description:
      'All my articles are written with the goal of helping you learn something new. I hope you enjoy them!',
    url: `${server}/articles`,
    type: 'website',
    siteName: '研之有物 - Innovative Researcher and Skilled Mentor',
    images: [
      {
        url: `${server}/images/og-image.png`,
        alt: '研之有物 - Innovative Researcher and Skilled Mentor',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@mir_sazzat',
    creator: '@mir_sazzat',
    title: 'Articles - 研之有物',
    description:
      'All my articles are written with the goal of helping you learn something new. I hope you enjoy them!',
    images: [
      {
        url: `${server}/images/og-image.png`,
        alt: '研之有物 - Innovative Researcher and Skilled Mentor',
        width: 1200,
        height: 630,
      },
    ],
  },

  // Canonical
  alternates: {
    canonical: `${server}/articles`,
    types: {
      'application/rss+xml': `${server}/feed.xml`,
    },
  },
}

// Get sorted articles from the contentlayer
async function getSortedArticles(): Promise<Article[]> {
  let articles = await allArticles

  articles = articles.filter((article: Article) => article.status === 'published')

  return articles.sort((a: Article, b: Article) => {
    if (a.publishedAt && b.publishedAt) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
    return 0
  })
}

export default async function Articles({
  params,
  searchParams,
}: {
  params?: unknown
  searchParams?: { [key: string]: string | string[] | undefined }
}): Promise<JSX.Element> {
  const articles = await getSortedArticles()
  const page = searchParams?.page ? parseInt(searchParams.page as string) : 1

  return (
    <SimpleLayout
      title='Writing on Programming, 3D, and WebGL'
      intro='All my articles are written with the goal of helping you learn something new. I hope you enjoy them!'
    >
      <SearchArticles articles={articles} />
    </SimpleLayout>
  )
}
