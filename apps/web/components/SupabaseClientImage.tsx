'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { memo, useEffect, useState } from 'react'

export interface SupabaseImageProps {
  src: string
  alt: string
}

function SupabaseImage({ alt, src }: SupabaseImageProps) {
  const supabase = createClientComponentClient()
  const [url, setUrl] = useState(src)
  useEffect(() => {
    supabase.storage
      .from('langliu')
      .createSignedUrl(src, 60)
      .then((data) => {
        if (!data.error) {
          setUrl(data.data?.signedUrl)
        }
      })
  }, [])

  if (url.startsWith('http')) {
    return <Image src={url} className='mr-2 rounded' width={200} height={300} alt={alt} />
  }
  return null
}

export default memo(SupabaseImage, (prev, next) => prev.src === next.src)
