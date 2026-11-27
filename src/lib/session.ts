import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { count } from 'drizzle-orm'

import { user } from './schema'

export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { getRequestHeaders } = await import('@tanstack/react-start/server')
  const { getAuth } = await import('./auth')
  return getAuth().api.getSession({
    headers: getRequestHeaders(),
  })
})

// 路由守卫只管页面跳转；server function 是可以直接调用的接口，读写私有数据的函数都要挂上它。
export const authMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const { getRequest } = await import('@tanstack/react-start/server')
  const { getAuth } = await import('./auth')
  const session = await getAuth().api.getSession({ headers: getRequest().headers })
  if (!session) {
    throw new Error('Unauthorized')
  }
  return next()
})

export const needsSetup = createServerFn({ method: 'GET' }).handler(async () => {
  const { getDb } = await import('./db')
  const rows = await getDb().select({ total: count() }).from(user)
  return (rows[0]?.total ?? 0) === 0
})
