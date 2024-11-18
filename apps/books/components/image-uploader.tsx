'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { upload } from '@vercel/blob/client'
import { AlertCircle, CheckCircle2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface ImageUploaderProps {
  value?: string | null
  onChange?: (url: string) => void
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError(null)
      setUploadedUrl(null)

      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        onUploadProgress: ({ percentage }) => setUploadProgress(percentage),
      })

      setUploadedUrl(blob.url)
      if (onChange) {
        onChange(blob.url)
      }
    } catch (err) {
      setError('An error occurred during upload. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const clearSelection = () => {
    setFile(null)
    setPreviewUrl(null)
    setUploadedUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    if (value) {
      setUploadedUrl(value)
    }
  }, [value])

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <Input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          disabled={uploading}
          className='h-11 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:font-semibold file:text-primary-foreground file:text-sm hover:file:bg-primary/90'
          ref={fileInputRef}
        />
        {file && (
          <Button variant='outline' size='icon' onClick={clearSelection} className='flex-shrink-0'>
            <X className='h-4 w-4' />
            <span className='sr-only'>Clear selection</span>
          </Button>
        )}
      </div>

      {previewUrl && !uploadedUrl && (
        <div className='relative h-48 w-full overflow-hidden rounded-lg'>
          <Image
            src={previewUrl}
            alt='Preview of selected image'
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      )}

      {file && !uploadedUrl && (
        <Button onClick={handleUpload} disabled={uploading} className='w-full'>
          {uploading ? 'Uploading...' : 'Upload Image'}
          <Upload className='ml-2 h-4 w-4' />
        </Button>
      )}

      {uploading && (
        <div className='space-y-2'>
          <Progress value={uploadProgress} className='w-full' />
          <p className='text-center text-gray-500 text-sm'>{uploadProgress.toFixed(0)}% uploaded</p>
        </div>
      )}

      {uploadedUrl && (
        <div className='space-y-2'>
          <div className='flex items-center space-x-2 text-green-600'>
            <CheckCircle2 className='h-5 w-5' />
            <p className='text-sm'>Upload successful!</p>
          </div>
          <div className='relative h-48 w-full overflow-hidden rounded-lg'>
            <Image src={uploadedUrl} alt='Uploaded image' fill style={{ objectFit: 'cover' }} />
          </div>
          <a
            href={uploadedUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary text-sm hover:underline'
          >
            View full size image
          </a>
        </div>
      )}

      {error && (
        <div className='flex items-center space-x-2 text-red-600'>
          <AlertCircle className='h-5 w-5' />
          <p className='text-sm'>{error}</p>
        </div>
      )}
    </div>
  )
}
