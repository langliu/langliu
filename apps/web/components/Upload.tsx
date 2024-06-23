'use client'
import { Button } from '@/components/ui/button'
import { CldUploadWidget, CldImage, type CldUploadWidgetProps } from 'next-cloudinary'

export interface UploadProps {
  value?: string
  onChange?: (value?: string) => void
}

export default function Upload({ value, onChange }: UploadProps) {
  const handleSuccess: CldUploadWidgetProps['onSuccess'] = (result, options) => {
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
          return <Button onClick={() => open()}>上传图片</Button>
        }}
      </CldUploadWidget>
    </div>
  )
}
