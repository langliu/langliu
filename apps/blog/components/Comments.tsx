'use client'
import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export default function Comments(): JSX.Element {
  const { theme } = useTheme()
  return (
    <div className='mt-10'>
      <h2 className='text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100'>评论</h2>
      <p className='mt-2 text-base text-zinc-600 dark:text-zinc-400 mb-4'>
        您是否有问题，想要分享反馈，或者讨论进一步的想法?欢迎在这里留言! 这个评论线程直接映射到{' '}
        <Link href='https://github.com/langliu/langliu/discussions/' target='blank'>
          <em className='text-teal-500'>GitHub上的讨论</em>
        </Link>
        ，所以如果你愿意，你也可以在那里评论。
      </p>
      <Giscus
        id='comments'
        repo='langliu/langliu'
        repoId='R_kgDOISuNyw'
        category='Comments'
        categoryId='DIC_kwDOISuNy84CXV-3'
        mapping='pathname'
        strict='0'
        reactionsEnabled='1'
        emitMetadata='0'
        inputPosition='top'
        theme={theme}
        lang='zh-CN'
        loading='lazy'
      />
      <p className='mt-2 text-base text-zinc-600 dark:text-zinc-400'>
        除了通过{' '}
        <Link href='https://giscus.app' target='blank' className='text-teal-500'>
          giscus
        </Link>{' '}
        进行验证, 你还可以直接在{' '}
        <Link href='https://github.com/langliu/langliu/discussions?discussions' target='_blank'>
          <em className='text-teal-500'>GitHub </em>
        </Link>
        上发表评论
      </p>
    </div>
  )
}
