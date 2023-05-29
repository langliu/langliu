import type { MDXComponents } from 'mdx/types'

import InlineCode from './InlineCode'
import Pre from './Pre'

export const components: MDXComponents = {
  pre: Pre,
  code: InlineCode,
}
