import type { MDXComponents } from 'mdx/types'

import InlineCode from './InlineCode'
import Pre from './Pre'
import Table from './Table'

export const components: MDXComponents = {
  pre: Pre,
  code: InlineCode,
  table: Table,
}
