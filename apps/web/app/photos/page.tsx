import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import React from 'react'

export async function getData() {
  const supabase = createServerComponentClient({ cookies })
  const { data: photos } = await supabase.from('photos').select()
  const { data } = await supabase.storage
    .from('langliu')
    .createSignedUrls(photos?.map((photo) => photo.url) ?? [], 60000)
  return { data }
}

const PhotosPage = async () => {
  const { data } = await getData()

  return (
    <div className='grid gap-2 col-span-4 grid-cols-4'>
      {data?.map((photo) => (
        <Image
          src={photo.signedUrl}
          alt='asd'
          className='object-cover w-full'
          width={0}
          height={0}
        />
      ))}
    </div>
  )
}

export default PhotosPage
