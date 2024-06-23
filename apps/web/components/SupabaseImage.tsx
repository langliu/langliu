'use server'
import { createClient } from '@/libs/supabase/server'
import Image from 'next/image'
import CldImage from './CldImage'

export interface SupabaseImageProps {
  src: string | null
  alt: string
}

export default async function SupabaseImage({ alt, src }: SupabaseImageProps) {
  const supabase = createClient()
  if (src?.startsWith('http')) {
    return <CldImage src={src} alt={alt} />
  }
  const { data, error } = await supabase.storage.from('langliu').createSignedUrl(src ?? '', 60)
  if (data?.signedUrl) {
    return (
      <Image src={data?.signedUrl} className="mr-2 rounded" width={200} height={300} alt={alt} />
    )
  }
  return null
}
