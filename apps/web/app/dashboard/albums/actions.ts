'use server'
import { createClient } from '@/libs/supabase/server'
import type { Database } from '@/types/supabase'
import { unstable_noStore as noStore } from 'next/cache'

const ITEMS_PER_PAGE = 10
export async function fetchFilteredInvoices(query: string, currentPage = 1, modelId?: string) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const supabase = createClient()
    const {
      data: albums,
      error,
      count,
    } = await supabase
      .from('albums')
      .select('*, models!inner(*), organizations(*)', { count: 'exact' })
      .match(
        modelId
          ? {
              'models.id': modelId,
            }
          : {},
      )
      .like('name', `%${query}%`)
      .range(offset, offset + ITEMS_PER_PAGE - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
    }
    return {
      albums,
      total: count,
    }
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoices.')
  }
}

/**
 * 获取所有模特
 * @returns
 */
export async function getAllModels() {
  const supabase = createClient()

  const { data: models, error } = await supabase
    .from('models')
    .select('*')
    .order('username', { ascending: true })
  if (error) {
    throw new Error(error.message)
  }
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
        organization: formData.organization,
      },
    ])
    .select()
  if (!error) {
    await supabase
      .from('models_albums')
      .insert(formData?.models?.map((model: any) => ({ album_id: data[0].id, model_id: model })))
  } else {
    console.log(error)
  }
}

/**
 * 获取所有机构
 * @returns
 */
export async function getAllOrganizations() {
  const supabase = createClient()

  const { data: models, error } = await supabase.from('organizations').select('*')
  if (error) {
    throw new Error(error.message)
  }
  return models
}
