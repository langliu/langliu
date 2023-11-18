import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { Database } from '@/libs/database.types'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  console.time('middleware')
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })
  await supabase.auth.getSession()
  console.timeEnd('middleware')
  return res
}
