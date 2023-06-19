import ListSnippets from './ListSnippets'
import SimpleLayout from 'components/SimpleLayout'
import SnippetsPlaceholder from 'components/skeleton/SnippetsPlaceholder'
import { server } from 'config'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: '代码片段',
  description: '我已经写了很长时间的代码。 以下是我发现有用且可重复使用的一些片段。',
  openGraph: {
    title: '代码片段 - 研之有物',
    description: '我已经写了很长时间的代码。 以下是我发现有用且可重复使用的一些片段。',
    url: `${server}/snippets`,
    type: 'website',
    siteName: '研之有物 - Innovative Researcher and Skilled Mentor',
    images: [
      {
        url: `${server}/images/og-image.png`,
        alt: '研之有物',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@mir_sazzat',
    creator: '@mir_sazzat',
    title: '代码片段 - 研之有物',
    description: '我已经写了很长时间的代码。 以下是我发现有用且可重复使用的一些片段。',
    images: [
      {
        url: `${server}/images/og-image.png`,
        alt: '研之有物',
        width: 1200,
        height: 630,
      },
    ],
  },
  alternates: {
    canonical: `${server}/snippets`,
    types: {
      'application/rss+xml': `${server}/feed.xml`,
    },
  },
}

export default function Snippets(): JSX.Element {
  return (
    <SimpleLayout
      title='我觉得有用的代码片段'
      intro='我已经写了很长时间的代码。 以下是我发现有用且可重复使用的一些片段。'
    >
      <div className='mt-16 sm:mt-20'>
        <Suspense fallback={<SnippetsPlaceholder />}>
          <ListSnippets />
        </Suspense>
      </div>
    </SimpleLayout>
  )
}
