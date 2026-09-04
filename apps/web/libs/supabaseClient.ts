import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const options = {
  db: {
    schema: 'public',
  },
}

let client: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Allow production builds without env; real requests still need valid values at runtime.
  client = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-anon-key',
    options,
  )
  return client
}

/** Lazily initialized browser/server Supabase client (legacy shared export). */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getSupabase(), prop, receiver)
    return typeof value === 'function' ? value.bind(getSupabase()) : value
  },
})
