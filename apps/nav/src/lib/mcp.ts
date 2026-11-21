import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { and, asc, eq, like, or, type SQL } from 'drizzle-orm'
import { z } from 'zod'
import { getDb } from './db'
import { category, navLink, subcategory } from './schema'

function jsonContent(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] }
}

function likePattern(query: string) {
  // Strip LIKE wildcards from user input; SQLite LIKE is already case-insensitive for ASCII.
  return `%${query.replace(/[%_]/g, ' ')}%`
}

async function upsertSubcategory(categoryName: string, subcategoryName: string) {
  const db = getDb()
  let cat = (await db.select().from(category).where(eq(category.name, categoryName)))[0]
  if (!cat) {
    const rows = await db.select({ sortOrder: category.sortOrder }).from(category)
    const sortOrder = rows.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    const inserted = {
      id: crypto.randomUUID(),
      name: categoryName,
      sortOrder,
      createdAt: new Date(),
    }
    await db.insert(category).values(inserted)
    cat = inserted
  }

  let sub = (
    await db
      .select()
      .from(subcategory)
      .where(and(eq(subcategory.categoryId, cat.id), eq(subcategory.name, subcategoryName)))
  )[0]
  if (!sub) {
    const rows = await db
      .select({ sortOrder: subcategory.sortOrder })
      .from(subcategory)
      .where(eq(subcategory.categoryId, cat.id))
    const sortOrder = rows.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
    const inserted = {
      id: crypto.randomUUID(),
      categoryId: cat.id,
      name: subcategoryName,
      sortOrder,
    }
    await db.insert(subcategory).values(inserted)
    sub = inserted
  }

  return sub
}

export function createNavMcpServer() {
  const server = new McpServer({ name: 'nav', version: '0.1.0' })

  server.registerTool(
    'list_categories',
    {
      title: '列出全部分类',
      description: '列出导航站的分类与小分类，以及每个小分类的站点数量。',
      inputSchema: {},
    },
    async () => {
      const db = getDb()
      const [cats, subs, links] = await Promise.all([
        db.select().from(category).orderBy(asc(category.sortOrder), asc(category.name)),
        db.select().from(subcategory).orderBy(asc(subcategory.sortOrder), asc(subcategory.name)),
        db.select({ subcategoryId: navLink.subcategoryId }).from(navLink),
      ])
      const countBySub = new Map<string, number>()
      for (const link of links) {
        countBySub.set(link.subcategoryId, (countBySub.get(link.subcategoryId) ?? 0) + 1)
      }
      return jsonContent(
        cats.map((cat) => ({
          分类: cat.name,
          小分类: subs
            .filter((sub) => sub.categoryId === cat.id)
            .map((sub) => ({ name: sub.name, links: countBySub.get(sub.id) ?? 0 })),
        })),
      )
    },
  )

  server.registerTool(
    'search_links',
    {
      title: '搜索站点',
      description: '按关键词搜索收藏的站点（匹配标题、URL 或描述），返回标题、链接与分类路径。',
      inputSchema: {
        query: z.string().trim().min(1),
        limit: z.number().int().min(1).max(100).default(20),
      },
    },
    async ({ query, limit }) => {
      const db = getDb()
      const pattern = likePattern(query)
      const rows = await db
        .select({
          title: navLink.title,
          url: navLink.url,
          description: navLink.description,
          subcategory: subcategory.name,
          category: category.name,
        })
        .from(navLink)
        .innerJoin(subcategory, eq(navLink.subcategoryId, subcategory.id))
        .innerJoin(category, eq(subcategory.categoryId, category.id))
        .where(
          or(
            like(navLink.title, pattern),
            like(navLink.url, pattern),
            like(navLink.description, pattern),
          ),
        )
        .orderBy(asc(navLink.title))
        .limit(limit)
      return jsonContent(
        rows.map((row) => ({
          标题: row.title,
          链接: row.url,
          描述: row.description,
          分类: `${row.category} / ${row.subcategory}`,
        })),
      )
    },
  )

  server.registerTool(
    'list_links',
    {
      title: '列出站点',
      description: '列出收藏的站点，可按分类名或小分类名过滤；不传参数时返回全部。',
      inputSchema: {
        category: z.string().trim().min(1).optional(),
        subcategory: z.string().trim().min(1).optional(),
        limit: z.number().int().min(1).max(200).default(100),
      },
    },
    async ({ category: categoryName, subcategory: subcategoryName, limit }) => {
      const db = getDb()
      const conditions: SQL[] = []
      if (categoryName) {
        conditions.push(eq(category.name, categoryName))
      }
      if (subcategoryName) {
        conditions.push(eq(subcategory.name, subcategoryName))
      }
      const rows = await db
        .select({
          title: navLink.title,
          url: navLink.url,
          description: navLink.description,
          subcategory: subcategory.name,
          category: category.name,
        })
        .from(navLink)
        .innerJoin(subcategory, eq(navLink.subcategoryId, subcategory.id))
        .innerJoin(category, eq(subcategory.categoryId, category.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(asc(category.sortOrder), asc(subcategory.sortOrder), asc(navLink.sortOrder))
        .limit(limit)
      return jsonContent(
        rows.map((row) => ({
          标题: row.title,
          链接: row.url,
          描述: row.description,
          分类: `${row.category} / ${row.subcategory}`,
        })),
      )
    },
  )

  server.registerTool(
    'create_link',
    {
      title: '收藏站点',
      description: '把一个站点收藏到导航站。分类或小分类不存在时会自动创建。',
      inputSchema: {
        category: z.string().trim().min(1).max(40),
        subcategory: z.string().trim().min(1).max(40),
        title: z.string().trim().min(1).max(80),
        url: z.url(),
        description: z.string().trim().max(120).optional(),
      },
    },
    async ({ category: categoryName, subcategory: subcategoryName, title, url, description }) => {
      const db = getDb()
      const sub = await upsertSubcategory(categoryName, subcategoryName)
      const rows = await db
        .select({ sortOrder: navLink.sortOrder })
        .from(navLink)
        .where(eq(navLink.subcategoryId, sub.id))
      const sortOrder = rows.reduce((max, row) => Math.max(max, row.sortOrder), -1) + 1
      await db.insert(navLink).values({
        id: crypto.randomUUID(),
        subcategoryId: sub.id,
        title,
        url,
        description: description || null,
        sortOrder,
      })
      return jsonContent({
        ok: true,
        分类: `${categoryName} / ${subcategoryName}`,
        标题: title,
        链接: url,
      })
    },
  )

  return server
}
