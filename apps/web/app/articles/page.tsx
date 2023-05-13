import { supabase } from '@/libs/supabaseClient'
import React from 'react'

export async function getData() {
  const { data } = await supabase.from('books').select('*')
  return data
}

const Page = async () => {
  const data = await getData()

  return (
    <div>
      Page
      <ul>
        {data?.map((country) => (
          <li key={country.id}>
            {country.name}
            {country.asd}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Page
