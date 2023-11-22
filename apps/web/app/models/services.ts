'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function createModel(formData: Object) {
  const supabase = createServerActionClient({ cookies })
  const { data, error } = await supabase.from('models').insert([formData]).select()
  if (error) {
    return false
  } else {
    revalidatePath('/models')
    return true
  }
}
