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
        Do you have a problem, want to share feedback, or discuss further ideas? Feel free to leave
        a comment here! Please stick to English. This comment thread directly maps to a{' '}
        <Link href='https://github.com/langliu/langliu/discussions/' target='blank'>
          <em className='text-teal-500'>discussion on GitHub</em>
        </Link>
        , so you can also comment there if you prefer.
      </p>
      <Giscus
        id='comments'
        repo='langliu/langliu'
        repoId='R_kgDOH7B9og'
        category='General'
        categoryId='DIC_kwDOH7B9os4CTPDr'
        mapping='pathname'
        data-strict='0'
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
