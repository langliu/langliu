import { createServerFn } from '@tanstack/react-start'
import { count } from 'drizzle-orm'
import { user } from './schema'

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestHeaders } = await import('@tanstack/react-start/server')
  const { getAuth } = await import('./auth')
  return getAuth().api.getSession({
    headers: getRequestHeaders(),
  })
})

export const needsSetup = createServerFn({ method: 'GET' }).handler(async () => {
  const { getDb } = await import('./db')
  const rows = await getDb().select({ total: count() }).from(user)
  return (rows[0]?.total ?? 0) === 0
})
