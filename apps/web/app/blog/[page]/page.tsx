import { components } from '@/components/markdown'
import '@/css/markdown.css'
import { getAllFilesFrontMatter } from '@/libs/mdx'
import { compileMDX } from 'next-mdx-remote/rsc'
import { Suspense } from 'react'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkToc from 'remark-toc'

type Props = {
  params: {
    page: string
  }
}

export const getData = async (slug: string) => {
  const totalPosts = await getAllFilesFrontMatter('blog')
  const totalPages = Math.ceil(totalPosts.length / 5)
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }))
  const current = totalPosts.find((item) => item.slug === slug)

  return {
    paths,
    fallback: false,
    current,
  }
}

export default async function BlogPage({ params }: Props) {
  const { page } = params
  const { current } = await getData(page)
  console.log(current?.title)

  const { content } = await compileMDX<{ title: string }>({
    source: current?.content ?? '',
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          [rehypeAutolinkHeadings, { behavior: 'prepend' }],
          [
            rehypePrettyCode,
            {
              theme: 'one-dark-pro',
              onVisitLine(node: { children: string | unknown[] }) {
                // Prevent lines from collapsing in `display: grid` mode, and
                // allow empty lines to be copy/pasted
                if (node.children.length === 0) {
                  node.children = [{ type: 'text', value: ' ' }]
                }
              },
              onVisitHighlightedLine(node: { properties: { className: string[] } }) {
                // Each line node by default has `class="line"`.
                node.properties.className.push('highlighted')
              },
              onVisitHighlightedWord(node: { properties: { className: string[] } }) {
                // Each word node has no className by default.
                node.properties.className = ['word']
              },
            },
          ],
        ],
        remarkPlugins: [[remarkToc, { heading: 'contents' }], [remarkGfm], [remarkMath]],
      },
    },
    components,
  })

  const date = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return (
    <Suspense>
      <div className='border-b border-b-slate-200 border-opacity-40 mb-6 text-center'>
        <p>{date.format(new Date(current?.date ?? new Date()))}</p>
        <h1 className='text-5xl font-bold mb-8'>{current?.title}</h1>
      </div>
      <div className='markdown'>{content}</div>
    </Suspense>
  )
}
