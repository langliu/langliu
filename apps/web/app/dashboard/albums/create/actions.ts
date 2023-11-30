'use server'
import { Database } from '@/types/supabase'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * 获取所有模特
 * @returns
 */
export async function getAllModels() {
  const supabase = createServerActionClient<Database>({ cookies })

  const { data: models, error } = await supabase.from('models').select('*')

  return models
}

export async function createModel(formData: Database['public']['Tables']['albums']['Insert']) {
  const supabase = createServerActionClient<Database>({ cookies })

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
      .from('album_to_model')
      .insert(formData?.models?.map((model: any) => ({ album: data[0].id, model: model })))
    revalidatePath('/dashboard/albums')
    redirect('/dashboard/albums')
  } else {
    console.log(error)
  }
}
