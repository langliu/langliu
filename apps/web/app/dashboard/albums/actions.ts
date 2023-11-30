import { Database } from '../../../types/supabase'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { unstable_noStore as noStore } from 'next/cache'
import { cookies } from 'next/headers'

const ITEMS_PER_PAGE = 10
export async function fetchFilteredInvoices(query: string, currentPage = 1) {
  noStore()
  const offset = (currentPage - 1) * ITEMS_PER_PAGE

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    const { data: albums, error } = await supabase
      .from('albums')
      .select('*, models(*)')
      .like('name', `%${query}%`)
      .range(offset, offset + ITEMS_PER_PAGE - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
    }
    console.log('albums', albums?.[0])
    return albums
  } catch (error) {
    console.error('Database Error:', error)
    throw new Error('Failed to fetch invoices.')
  }
}
