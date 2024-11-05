// 'use client'
'use server'
import { isJSONStr } from '@/utils'
import { CircleArrowRight } from 'lucide-react'
import Form from 'next/form'
import Image from 'next/image'
import { translate } from './actions'
export default async function Home() {
  return (
    <div className='grid min-h-screen grid-rows-[1fr_20px] gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
      <main className='w-full'>
        <Form className={'flex h-full w-full items-center gap-8'} action={translate}>
          <textarea
            className={'h-full w-1/2 rounded-md border border-gray-200 p-4 align-top text-black'}
            placeholder={'请输入JSON格式的字符串'}
            name={'input'}
          />
          <button type={'submit'}>
            <CircleArrowRight size={40} className={'text-gray-400'} strokeWidth={1} />
          </button>
          <textarea
            className={'h-full w-1/2 cursor-not-allowed rounded-md text-black'}
            disabled
            name={'output'}
          />
        </Form>
      </main>
      <footer className='flex flex-wrap items-center justify-center gap-6'>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/file.svg' alt='File icon' width={16} height={16} />
          Learn
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/window.svg' alt='Window icon' width={16} height={16} />
          Examples
        </a>
        <a
          className='flex items-center gap-2 hover:underline hover:underline-offset-4'
          href='https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
        >
          <Image aria-hidden src='/globe.svg' alt='Globe icon' width={16} height={16} />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
