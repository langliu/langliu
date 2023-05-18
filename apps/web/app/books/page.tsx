import styles from './page.module.css'
import { supabase } from '@/libs/supabaseClient'
import Link from 'next/link'
import React from 'react'

export const runtime = 'edge'

export async function getData() {
  const { data } = await supabase.from('books').select('*')
  return data
}

const Page = async () => {
  const data = await getData()

  return (
    <div>
      <div className='flex gap-2'>
        <h1>书籍📕</h1>
        <Link href={'/books/create'}>
          <button type='button' title='新建书籍'>
            新建
          </button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>书名</th>
            <th>作者</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((country) => (
            <tr key={country.id}>
              <td> {country.name}</td>
              <td> {country.author ?? '未知'}</td>
              <td> {country.end ? '完结' : '连载'}</td>
              <td>
                <Link href={`/books/${country.id}`}>查看</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Page
