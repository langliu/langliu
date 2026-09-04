'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/libs/supabaseClient'

export default function Page() {
  const [rows, setRows] = useState<{ id?: string; name?: string; asd?: string }[] | null>(null)

  useEffect(() => {
    void supabase
      .from('countries')
      .select()
      .then(({ data }) => setRows(data))
  }, [])

  const onClick = async () => {
    await supabase.from('countries').insert([{ name: 'someValue', asd: 'otherValue' }])
    const { data } = await supabase.from('countries').select()
    setRows(data)
  }

  const signWithGithub = async () => {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    })
    console.log(data)
  }

  return (
    <div>
      <h1>Countries</h1>
      <button type='button' onClick={onClick}>
        插入数据
      </button>

      <button type='button' onClick={signWithGithub}>
        Github登录
      </button>

      <ul>
        {rows?.map((country) => (
          <li key={country.id ?? `${country.name}-${country.asd}`}>
            {country.name}
            {country.asd}
          </li>
        ))}
      </ul>
    </div>
  )
}
