'use client'
import { CldImage, CldUploadWidget, type CldUploadWidgetProps } from 'next-cloudinary'
import { Button } from '@/components/ui/button'

export interface UploadProps {
  value?: string
  onChange?: (value?: string) => void
}

export default function Upload({ value, onChange }: UploadProps) {
  const handleSuccess: CldUploadWidgetProps['onSuccess'] = (result) => {
    if (result.event === 'success') {
      const info = result.info
      if (info && typeof info !== 'string' && 'url' in info) {
        onChange?.(info.url)
      }
    }
  }

  return (
    <div>
      <CldUploadWidget uploadPreset='tflos5a3' onSuccess={handleSuccess}>
        {({ open }) => {
          return <Button onClick={() => open()}>上传图片</Button>
        }}
      </CldUploadWidget>
      {value && <CldImage width={300} height={600} src={value} alt='专辑封面' />}
    </div>
  )
}
