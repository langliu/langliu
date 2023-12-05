import { Database } from '@/types/supabase'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Popover } from 'antd'
import { cookies } from 'next/headers'
import Image from 'next/image'

interface AvatarProps {
  record: Database['public']['Tables']['models']['Row']
}

export default async function Avatar({ record }: AvatarProps) {
  const supabase = createServerComponentClient({ cookies })

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
      placement="right"
    >
      <Image
        src={record?.avatar}
        className="rounded-full object-cover w-16 h-16"
        width={64}
        height={64}
        alt={`${record.username}的头像`}
      />
    </Popover>
  )
}
