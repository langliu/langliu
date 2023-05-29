import { supabase } from '@/libs/supabaseClient'
import Image from 'next/image'
import React from 'react'

export async function getData() {
  const { data: photos, error } = await supabase.from('photos').select()
  console.table(photos)
  const { data, error: signedError } = await supabase.storage
    .from('langliu')
    .createSignedUrls(photos?.map((photo) => photo.url) ?? [], 60000)
  return { data }
}

const PhotosPage = async () => {
  const { data } = await getData()
  console.table(data)
  return (
    <div className='flex gap-2'>
      {data?.map((photo) => (
        <div className='w-24 relative h-36'>
          <Image src={photo.signedUrl} fill alt='asd' className='object-cover' />
        </div>
      ))}
    </div>
  )
}

export default PhotosPage
