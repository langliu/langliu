import { Article } from './content/definitions/Article'
import { Snippets } from './content/definitions/Snippet'
import withToc from '@stefanprobst/rehype-extract-toc'
import withTocExport from '@stefanprobst/rehype-extract-toc/mdx'
import { makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode, { type Options, type VisitableElement } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

// Rehype Pretty Code Configuration
const PrettyCodeOptions: Partial<Options> = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  onVisitLine(node: VisitableElement) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }]
    }
  },
  onVisitHighlightedLine(node: VisitableElement) {
    node.properties.className?.push('highlighted')
  },

  onVisitHighlightedWord(node: VisitableElement) {
    node.properties.className = ['word']
  },
}

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Article, Snippets],
  mdx: {
    esbuildOptions(options) {
      options.target = 'esnext'
      return options
    },
    remarkPlugins: [[remarkGfm], [remarkMath]],
    rehypePlugins: [
      [rehypeKatex],
      [rehypeSlug],
      [rehypePrettyCode, PrettyCodeOptions],
      [withToc],
      [withTocExport, { name: 'toc' }],
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
  },
})
