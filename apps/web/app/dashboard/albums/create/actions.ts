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

export async function createModel(formData: Database['public']['Tables']['albums']['Insert']) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('albums')
    .insert([
      {
        name: formData.name,
        cover: formData.cover,
        picture_num: formData.picture_num,
        video_num: formData.video_num,
        collected: formData.collected,
      },
    ])
    .select()
  if (!error) {
    await supabase
      .from('models_albums')
      .insert(formData?.models?.map((model: any) => ({ album_id: data[0].id, model_id: model })))
    revalidatePath('/dashboard/albums')
    redirect('/dashboard/albums')
  } else {
    console.log(error)
  }
}
