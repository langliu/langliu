import { CreateBook } from './components/CreateBook'
import Search from './components/Search'
import styles from './page.module.css'
import { createClient } from '@/libs/supabase/server'
import Link from 'next/link'
import React from 'react'

export async function getData() {
  const supabase = createClient()
  const { data } = await supabase.from('books').select('*')
  return data
}

export default async function Page() {
  const data = await getData()

  return (
    <div className="py-6 px-8">
      <h1 className="text-2xl">书籍管理</h1>
      <div className="flex gap-4 mt-4 mb-6 items-center">
        <Search placeholder="请输入书籍名称进行搜索" />
        <CreateBook />
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
