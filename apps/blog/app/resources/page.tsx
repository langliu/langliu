import ListResources from './ListResources'
import SimpleLayout from 'components/SimpleLayout'
import ResourcesPlaceholder from 'components/skeleton/ResourcesPlaceholder'
import { server } from 'config'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: '资源',
  description:
    'These materials have been tremendously beneficial to me in my learning path. I hope you find these helpful as well!',
  openGraph: {
    title: '资源 - 研之有物',
    description: '这些资料在我的学习道路上给了我极大的帮助。 我希望你发现这些也有帮助！',
    url: `${server}/resources`,
    type: 'website',
    siteName: '研之有物 - 创新的研究员和熟练的导师',
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
    title: '资源 - 研之有物',
    description: '这些资料在我的学习道路上给了我极大的帮助。 我希望你发现这些也有帮助！',
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
    canonical: `${server}/resources`,
    types: {
      'application/rss+xml': `${server}/feed.xml`,
    },
  },
}

export default function Resources(): JSX.Element {
  return (
    <SimpleLayout
      title='一些值得分享的优秀资源'
      intro='这些资料在我的学习道路上给了我极大的帮助。 我希望你发现这些也有帮助！'
    >
      <div className='mt-16 sm:mt-20'>
        <Suspense fallback={<ResourcesPlaceholder />}>
          <ListResources />
        </Suspense>
      </div>
    </SimpleLayout>
  )
}
