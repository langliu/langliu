import Image from 'next/image'
import React from 'react'
import { createClient } from '@/libs/supabase/server'
import Photo from './Photo'

export async function getData() {
  const supabase = createClient()
  const { data: photos } = await supabase.from('photos').select()
  const { data } = await supabase.storage
    .from('langliu')
    .createSignedUrls(photos?.map((photo) => photo.url) ?? [], 60000)
  return { data }
}

// export async function insertPhoto(url: string) {
//   const supabase = createServerComponentClient({ cookies })
//   const { data } = await supabase.from('photos').insert({
//     url,
//     name: url,
//   })
//   return { data }
// }

const PhotosPage = async () => {
  const { data } = await getData()

  return (
    <div>
      <Photo />
      <div className='col-span-4 grid grid-cols-4 gap-2'>
        {data?.map((photo) => (
          <Image
            src={photo.signedUrl}
            alt='asd'
            className='w-full object-cover'
            width={0}
            height={0}
            key={photo.signedUrl}
          />
        ))}
      </div>
    </div>
  )
}

export default PhotosPage
