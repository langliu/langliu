import Photo from './Photo'
import { createClient } from '@/libs/supabase/server'
import Image from 'next/image'
import React from 'react'

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
      <div className="grid gap-2 col-span-4 grid-cols-4">
        {data?.map((photo) => (
          <Image
            src={photo.signedUrl}
            alt="asd"
            className="object-cover w-full"
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
