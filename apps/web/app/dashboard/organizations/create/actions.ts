'use server'
import type { Database } from '@/types/supabase'
import { createClient } from '@/libs/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * 获取所有模特
 * @returns
 */
export async function getAllModels() {
  const supabase = createClient()

  const { data: models, error } = await supabase.from('models').select('*')

  return models
}

export async function createModel(
  formData: Database['public']['Tables']['organizations']['Insert'],
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('organizations')
    .insert([
      {
        name: formData.name,
        url: formData.url,
      },
    ])
    .select()
  if (!error) {
    revalidatePath('/dashboard/organizations')
    redirect('/dashboard/organizations')
  } else {
    console.log(error)
  }
}
