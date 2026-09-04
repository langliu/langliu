'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/libs/supabase/server'

export const createBook = async (formData: object) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('books').insert({
    ...formData,
  })
  if (error) {
    throw new Error(error.message)
  }
  revalidatePath('/models')
  redirect('/books')
}
