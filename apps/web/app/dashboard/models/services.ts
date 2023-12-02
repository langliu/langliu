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
    revalidatePath('/dashboard/models')
    return true
  }
}

export async function updateModel(id: number, formData: Object) {
  const supabase = createServerActionClient({ cookies })
  const { data, error } = await supabase
    .from('models')
    .update({ ...formData, updated_at: new Date().toUTCString() })
    .eq('id', id)
    .select()
  console.log('id', id, typeof id)
  if (error) {
    console.log('error', error)
    return false
  } else {
    console.log('data', data)
    revalidatePath('/dashboard/models')
    return true
  }
}
