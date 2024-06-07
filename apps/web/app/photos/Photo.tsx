'use client'
import { Database } from '../database.types'
import { createClient } from '@/libs/supabase/client'
import type React from 'react'
import { useState } from 'react'

const insertPhoto = async (url: string) => {
  'use client'
  const supabase = createClient()
  const { data } = await supabase.from('photos').insert({
    url,
    name: url,
  })
  return { data }
}

export default function Avatar() {
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('langliu').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (uploadError) {
        alert(uploadError.message)
        throw uploadError
      }

      insertPhoto(filePath)
    } catch (error) {
      alert('Error uploading avatar!')
      alert(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
}
