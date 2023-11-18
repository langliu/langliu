import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'

export interface AvatarProps {
  src: StaticImport
}

export default function Avatar({ src }: AvatarProps) {
  return (
    <Image
      src={src}
      className='rounded-full'
      width={28}
      height={28}
      alt={`${invoice.name}'s profile picture`}
    />
  )
}
