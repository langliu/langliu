'use server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'

export interface SupabaseImageProps {
  src: string
  alt: string
}

export default async function SupabaseImage({ alt, src }: SupabaseImageProps) {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase.storage.from('langliu').createSignedUrl(src, 60)
  if (data?.signedUrl) {
    return (
      <Image src={data?.signedUrl} className='mr-2 rounded' width={200} height={300} alt={alt} />
    )
  }
  return null
}
