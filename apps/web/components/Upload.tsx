import { createClient } from '@/libs/supabase/client'
import SupabaseImage from './SupabaseClientImage'

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

  return (
    <div>
      {value && <SupabaseImage src={value} alt="专辑封面" />}
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={handleChange}
        title="upload"
      />
    </div>
  )
}
