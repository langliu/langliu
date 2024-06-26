'use client'
import { createClient } from '@/libs/supabase/client'
import Image from 'next/image'
import { type FC, memo, useEffect, useState } from 'react'

export interface SupabaseImageProps {
  src: string
  alt: string
}

const SupabaseImage: FC<SupabaseImageProps> = ({ alt, src }) => {
  const supabase = createClient()
  const [url, setUrl] = useState(src)

  useEffect(() => {
    supabase.storage
      .from('langliu')
      .createSignedUrl(src, 3600 * 24 * 30)
      .then((data) => {
        if (!data.error) {
          setUrl(data.data?.signedUrl)
        }
      })
  }, [supabase, src])

  if (url.startsWith('http')) {
    return <Image src={url} className="mr-2 rounded" width={200} height={300} alt={alt} />
  }
  return null
}

export default memo(SupabaseImage, (prev, next) => prev.src === next.src)
