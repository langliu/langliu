import Pre from '@/components/Pre'
import '@/css/markdown.css'
// // import { POSTS_PER_PAGE } from '../../blog'
// // import { PageSEO } from '@/components/SEO'
// import siteMetadata from '@/data/siteMetadata'
// import ListLayout from '@/layouts/ListLayout'
import { getAllFilesFrontMatter } from '@/libs/mdx'
import { MDXRemote } from 'next-mdx-remote/rsc'
// import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
// import { PostFrontMatter } from 'types/PostFrontMatter'
// const POSTS_PER_PAGE = 5
// export const getStaticPaths: GetStaticPaths<{ page: string }> = async () => {
//   const totalPosts = await getAllFilesFrontMatter('blog')
//   const totalPages = Math.ceil(totalPosts.length / 5)
//   const paths = Array.from({ length: totalPages }, (_, i) => ({
//     params: { page: (i + 1).toString() },
//   }))

//   return {
//     paths,
//     fallback: false,
//   }
// }

// export const getStaticProps: GetStaticProps<{
//   posts: PostFrontMatter[]
//   initialDisplayPosts: PostFrontMatter[]
//   pagination: { currentPage: number; totalPages: number }
// }> = async (context) => {
//   const {
//     params: { page },
//   } = context
//   const posts = await getAllFilesFrontMatter('blog')
//   const pageNumber = parseInt(page as string)
//   const initialDisplayPosts = posts.slice(
//     POSTS_PER_PAGE * (pageNumber - 1),
//     POSTS_PER_PAGE * pageNumber,
//   )
//   const pagination = {
//     currentPage: pageNumber,
//     totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
//   }

//   return {
//     props: {
//       posts,
//       initialDisplayPosts,
//       pagination,
//     },
//   }
// }

// export default function PostPage({
//   posts,
//   initialDisplayPosts,
//   pagination,
// }: InferGetStaticPropsType<typeof getStaticProps>) {
//   return (
//     <>
//       {/* <PageSEO title={siteMetadata.title} description={siteMetadata.description} /> */}
//       <ListLayout
//         posts={posts}
//         initialDisplayPosts={initialDisplayPosts}
//         pagination={pagination}
//         title='All Posts'
//       />
//     </>
//   )
// }

type Props = {
  params: {
    page: string
  }
}

const components = {
  h1: (props) => (
    <h1 {...props} className='text-2xl'>
      {props.children}
    </h1>
  ),
  h2: ({ children }) => <h2 className='text-2xl'>{children}</h2>,
  pre: Pre,
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
  console.log('posts', page)
  const { paths, current } = await getData(page)
  console.log('paths', paths)

  return (
    <div>
      123
      <MDXRemote source={current?.content} components={{ ...components }} />
    </div>
  )
}
