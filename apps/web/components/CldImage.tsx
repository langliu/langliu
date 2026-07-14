'use client'
import { CldImage } from 'next-cloudinary'

export interface SupabaseImageProps {
  src: string
  alt: string
}

export default function SupabaseImage({ alt, src }: SupabaseImageProps) {
  return (
    <CldImage
      src={src}
      className='mr-2 w-52 rounded'
      width={530}
      height={792}
      alt={alt}
      crop='fill'
    />
  )
}
