import SnippetPage from './Snippet'
import { Container } from 'components/Container'
import { server } from 'config'
import { Snippet, allSnippets } from 'contentlayer/generated'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const runtime = 'edge'

// get snippets from the contentlayer
async function getAllSnippets(): Promise<Snippet[]> {
  return await allSnippets
}

// generate a metadata for this page
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const snippet = await getAllSnippets().then((snippets) =>
    snippets.find((snippet) => snippet.slug === params.slug),
  )

  return {
    title: snippet?.title,
    description: snippet?.description,
    openGraph: {
      title: snippet?.title,
      description: snippet?.description,
      url: `${server}/snippets/${snippet?.slug}`,
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
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@mir_sazzat',
      creator: '@mir_sazzat',
      title: snippet?.title,
      description: snippet?.description,
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
      canonical: `${server}/snippets/${snippet?.slug}`,
      types: {
        'application/rss+xml': `${server}/feed.xml`,
      },
    },
  }
}

export default async function Page({
  params,
}: {
  params: { slug: string }
}): Promise<JSX.Element> {
  const { slug } = params
  const snippet = await getAllSnippets().then((snippets) =>
    snippets.find((snippet) => snippet.slug === slug),
  )

  if (!snippet) return notFound()

  return (
    <Container className='mt-16 lg:mt-32'>
      <SnippetPage snippet={snippet} />
    </Container>
  )
}
