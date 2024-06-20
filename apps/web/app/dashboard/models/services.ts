'use server'
import { createClient } from '@/libs/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createModel(formData: Record<string, unknown>) {
  const supabase = createClient()
  const { data, error } = await supabase.from('models').insert([formData]).select()
  if (error) {
    return false
  }
  revalidatePath('/dashboard/models')
  return true
}

export async function updateModel(id: number, formData: Record<string, unknown>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('models')
    .update({ ...formData, updated_at: new Date().toUTCString() })
    .eq('id', id)
    .select()
  console.log('id', id, typeof id)
  if (error) {
    console.log('error', error)
    return false
  }
  console.log('data', data)
  revalidatePath('/dashboard/models')
  return true
}
