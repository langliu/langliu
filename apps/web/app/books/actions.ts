'use server'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const createBook = async (formData: any) => {
  const supabase = createServerActionClient({ cookies })
  const { data, error } = await supabase.from('books').insert({
    ...formData,
  })
  if (error) {
    throw new Error(error.message)
  } else {
    revalidatePath('/models')
    redirect('/books')
  }
}
