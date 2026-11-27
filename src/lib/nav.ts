import { createServerFn } from '@tanstack/react-start'
import { asc, eq } from 'drizzle-orm'
import { z } from 'zod'

import { category, navLink, subcategory } from './schema'

export type NavLinkItem = {
  id: string
  subcategoryId: string
  title: string
  url: string
  description: string | null
}

export type NavSubcategory = {
  id: string
  name: string
  links: NavLinkItem[]
}

export type NavCategory = {
  id: string
  name: string
  subcategories: NavSubcategory[]
}

async function requireUser() {
  const { getRequestHeaders } = await import('@tanstack/react-start/server')
  const { getAuth } = await import('./auth')
  const session = await getAuth().api.getSession({
    headers: getRequestHeaders(),
  })
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export const getNavBoard = createServerFn({ method: 'GET' }).handler(async () => {
  await requireUser()
  const { getDb } = await import('./db')
  const db = getDb()
  const [categories, subcategories, links] = await Promise.all([
    db.select().from(category).orderBy(asc(category.sortOrder), asc(category.name)),
    db.select().from(subcategory).orderBy(asc(subcategory.sortOrder), asc(subcategory.name)),
    db.select().from(navLink).orderBy(asc(navLink.sortOrder), asc(navLink.title)),
  ])

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    subcategories: subcategories
      .filter((sub) => sub.categoryId === cat.id)
      .map((sub) => ({
        id: sub.id,
        name: sub.name,
        links: links
          .filter((link) => link.subcategoryId === sub.id)
          .map((link) => ({
            id: link.id,
            subcategoryId: link.subcategoryId,
            title: link.title,
            url: link.url,
            description: link.description,
          })),
      })),
  })) satisfies NavCategory[]
})

export const createCategory = createServerFn({ method: 'POST' })
  .validator(z.object({ name: z.string().trim().min(1).max(40) }))
  .handler(async ({ data }) => {
    await requireUser()
    const { getDb } = await import('./db')
    const db = getDb()
    const existing = await db.select({ sortOrder: category.sortOrder }).from(category)
    const sortOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    await db.insert(category).values({
      id: crypto.randomUUID(),
      name: data.name,
      sortOrder,
      createdAt: new Date(),
    })
    return { ok: true as const }
  })

export const createSubcategory = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      categoryId: z.string().min(1),
      name: z.string().trim().min(1).max(40),
    }),
  )
  .handler(async ({ data }) => {
    await requireUser()
    const { getDb } = await import('./db')
    const db = getDb()
    const parent = await db
      .select({ id: category.id })
      .from(category)
      .where(eq(category.id, data.categoryId))
    if (!parent[0]) {
      throw new Error('分类不存在')
    }
    const existing = await db
      .select({ sortOrder: subcategory.sortOrder })
      .from(subcategory)
      .where(eq(subcategory.categoryId, data.categoryId))
    const sortOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    await db.insert(subcategory).values({
      id: crypto.randomUUID(),
      categoryId: data.categoryId,
      name: data.name,
      sortOrder,
    })
    return { ok: true as const }
  })

export const createLink = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      subcategoryId: z.string().min(1),
      title: z.string().trim().min(1).max(80),
      url: z.url(),
      description: z.string().trim().max(120).optional(),
    }),
  )
  .handler(async ({ data }) => {
    await requireUser()
    const { getDb } = await import('./db')
    const db = getDb()
    const parent = await db
      .select({ id: subcategory.id })
      .from(subcategory)
      .where(eq(subcategory.id, data.subcategoryId))
    if (!parent[0]) {
      throw new Error('小分类不存在')
    }
    const existing = await db
      .select({ sortOrder: navLink.sortOrder })
      .from(navLink)
      .where(eq(navLink.subcategoryId, data.subcategoryId))
    const sortOrder = existing.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    await db.insert(navLink).values({
      id: crypto.randomUUID(),
      subcategoryId: data.subcategoryId,
      title: data.title,
      url: data.url,
      description: data.description || null,
      sortOrder,
    })
    return { ok: true as const }
  })

export const updateLink = createServerFn({ method: 'POST' })
  .validator(
    z.object({
      id: z.string().min(1),
      subcategoryId: z.string().min(1),
      title: z.string().trim().min(1).max(80),
      url: z.url(),
      description: z.string().trim().max(120).optional(),
    }),
  )
  .handler(async ({ data }) => {
    await requireUser()
    const { getDb } = await import('./db')
    const db = getDb()
    const parent = await db
      .select({ id: subcategory.id })
      .from(subcategory)
      .where(eq(subcategory.id, data.subcategoryId))
    if (!parent[0]) {
      throw new Error('小分类不存在')
    }
    await db
      .update(navLink)
      .set({
        subcategoryId: data.subcategoryId,
        title: data.title,
        url: data.url,
        description: data.description || null,
      })
      .where(eq(navLink.id, data.id))
    return { ok: true as const }
  })

export const deleteLink = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    await requireUser()
    const { getDb } = await import('./db')
    await getDb().delete(navLink).where(eq(navLink.id, data.id))
    return { ok: true as const }
  })
