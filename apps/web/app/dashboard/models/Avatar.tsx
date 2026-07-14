import { Popover } from 'antd'
import Image from 'next/image'
import { createClient } from '@/libs/supabase/server'
import type { Database } from '@/types/supabase'

interface AvatarProps {
  record: Database['public']['Tables']['models']['Row']
}

export default async function Avatar({ record }: AvatarProps) {
  const supabase = createClient()

  if (!record?.avatar) {
    return null
  }

  if (!record.avatar.startsWith('http')) {
    const { data, error } = await supabase.storage
      .from('langliu')
      .createSignedUrl(record.avatar, 3600 * 24 * 30)
    if (!error) {
      record.avatar = data.signedUrl
    }
  }

  return (
    <Popover
      content={
        <Image src={record?.avatar} width={400} height={400} alt={`${record.username}的头像`} />
      }
      title={record.username}
      placement='right'
    >
      <Image
        src={record?.avatar}
        className='h-16 w-16 rounded-full object-cover'
        width={64}
        height={64}
        alt={`${record.username}的头像`}
      />
    </Popover>
  )
}
