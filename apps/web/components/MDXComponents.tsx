import Image from './Image'
import TOCInline from './TOCInline'
// import { BlogNewsletterForm } from './NewsletterForm'
import Pre from './markdown/Pre'
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client'
import CustomLink from 'next/link'
/* eslint-disable react/display-name */
import React, { useMemo } from 'react'

const Wrapper: React.ComponentType<{ layout: string }> = ({ layout, ...rest }) => {
  const Layout = require(`../layouts/${layout}`).default
  return <Layout {...rest} />
}

export const MDXComponents: ComponentMap = {
  Image,
  //@ts-ignore
  TOCInline,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
  //@ts-ignore
  // BlogNewsletterForm,
}

interface Props {
  layout: string
  mdxSource: string
  [key: string]: unknown
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }: Props) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
