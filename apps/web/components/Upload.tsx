'use client'
import { createClient } from '@/libs/supabase/client'
import { Button } from '@/components/ui/button'
import { CldUploadWidget, CldImage, type CldUploadWidgetProps } from 'next-cloudinary'

export interface UploadProps {
  value?: string
  onChange?: (value?: string) => void
}

export default function Upload({ value, onChange }: UploadProps) {
  const supabase = createClient()
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file, crypto.randomUUID())
    if (file) {
      const { data, error } = await supabase.storage
        .from('langliu')
        .upload(`album/${crypto.randomUUID()}.${file.name.split('.').pop()}`, file)
      if (error) {
        console.error(error)
      } else {
        console.log('path', data.path)
        onChange?.(data.path)
      }
    }
  }

  const handleSuccess: CldUploadWidgetProps['onSuccess'] = (result, options) => {
    console.log(result, options)
    if (result.event === 'success') {
      if ('url' in result?.info) {
        onChange?.(result?.info?.url)
      }
    }
  }

  return (
    <div>
      {value && <CldImage width={375} height={800} src={value} alt="专辑封面" />}
      <CldUploadWidget uploadPreset="tflos5a3" onSuccess={handleSuccess}>
        {({ open }) => {
          return <Button onClick={() => open()}>Upload</Button>
        }}
      </CldUploadWidget>
    </div>
  )
}
