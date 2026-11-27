import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { novelStatuses } from './novel-utils'
import { authMiddleware } from './session'

const idSchema = z.string().trim().min(1, '缺少 ID')

const COVER_KEY_RE = /^\/covers\/[a-z0-9-]+\.(png|jpg|webp|gif)$/i

function isValidCoverUrl(value: string): boolean {
  if (COVER_KEY_RE.test(value)) {
    return true
  }
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const novelInputSchema = z.object({
  name: z.string().trim().min(1, '请填写名称').max(100, '名称最多 100 个字'),
  author: z.string().trim().max(50, '作者最多 50 个字').optional(),
  cover: z
    .string()
    .trim()
    .max(500, '封面地址过长')
    // 上传到对象存储时是站内相对路径（/covers/<key>），也可以手填绝对地址
    .refine(isValidCoverUrl, {
      error: '封面需要是合法的图片地址',
    })
    .optional(),
  intro: z.string().trim().max(2000, '简介最多 2000 个字').optional(),
  status: z.enum(novelStatuses, { error: '状态不合法' }),
})

const volumeInputSchema = z.object({
  novelId: idSchema,
  id: idSchema.optional(),
  name: z.string().trim().min(1, '请填写分卷名称').max(100, '分卷名称最多 100 个字'),
})

// 单章 30 万字约 900 KB，远低于 D1 单行 2 MB 的上限
const chapterInputSchema = z.object({
  novelId: idSchema,
  id: idSchema.optional(),
  volumeId: idSchema.nullable(),
  title: z.string().trim().min(1, '请填写章节标题').max(200, '章节标题最多 200 个字'),
  content: z.string().max(300000, '单章正文最多 30 万字'),
})

/** 把 zod 的第一条错误信息变成普通的 Error，前端拿到的就是一句能直接显示的中文。 */
function validated<T extends z.ZodType>(schema: T) {
  return (data: unknown) => {
    const parsed = schema.safeParse(data)
    if (!parsed.success) {
      throw new Error(parsed.error.issues[0]?.message ?? '提交的内容不合法')
    }
    return parsed.data
  }
}

export const listNovels = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async () => {
    const store = await import('./novels.server')
    return store.listNovels()
  })

export const getNovel = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(validated(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    const detail = await store.getNovel(data.id)
    if (!detail) {
      throw notFound()
    }
    return detail
  })

export const createNovel = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(novelInputSchema))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    return { id: await store.createNovel(data) }
  })

export const updateNovel = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(novelInputSchema.extend({ id: idSchema })))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    if (!(await store.updateNovel(data.id, data))) {
      throw notFound()
    }
  })

export const deleteNovel = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(z.object({ id: idSchema })))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    if (!(await store.deleteNovel(data.id))) {
      throw notFound()
    }
  })

export const saveVolume = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(volumeInputSchema))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    const id = await store.saveVolume(data.novelId, data)
    if (!id) {
      throw notFound()
    }
    return { id }
  })

export const deleteVolume = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(z.object({ novelId: idSchema, id: idSchema })))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    if (!(await store.deleteVolume(data.novelId, data.id))) {
      throw notFound()
    }
  })

const moveSchema = z.object({
  novelId: idSchema,
  id: idSchema,
  direction: z.enum(['up', 'down'], { error: '移动方向不合法' }),
})

export const moveVolume = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(moveSchema))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    await store.moveVolume(data.novelId, data.id, data.direction)
  })

export const saveChapter = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(chapterInputSchema))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    const result = await store.saveChapter(data)
    if (!result) {
      throw notFound()
    }
    return result
  })

export const deleteChapter = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(z.object({ novelId: idSchema, id: idSchema })))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    if (!(await store.deleteChapter(data.novelId, data.id))) {
      throw notFound()
    }
  })

export const moveChapter = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(validated(moveSchema))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    await store.moveChapter(data.novelId, data.id, data.direction)
  })

export const getChapter = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(validated(z.object({ novelId: idSchema, id: idSchema })))
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    const chapter = await store.getChapter(data.novelId, data.id)
    if (!chapter) {
      throw notFound()
    }
    return chapter
  })

// TXT 导入按批提交：免费版 Worker 单次调用最多跑 50 条 SQL，一批控制在 40 章以内
export const importChaptersBatch = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    validated(
      z.object({
        novelId: idSchema,
        volumeId: idSchema.nullable(),
        chapters: z
          .array(
            z.object({
              title: z.string().trim().min(1, '章节标题不能为空').max(200, '章节标题最多 200 个字'),
              content: z.string().max(300000, '单章正文最多 30 万字'),
            }),
          )
          .min(1, '这一批没有章节')
          .max(40, '一次最多导入 40 章'),
      }),
    ),
  )
  .handler(async ({ data }) => {
    const store = await import('./novels.server')
    return {
      imported: await store.importChaptersBatch(data.novelId, data.volumeId, data.chapters),
    }
  })

const COVER_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const COVER_MAX_BYTES = 2 * 1024 * 1024

export const uploadCover = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error('提交格式不正确')
    }
    const file = data.get('file')
    if (!(file instanceof File)) {
      throw new Error('缺少封面文件')
    }
    if (!(file.type in COVER_TYPES)) {
      throw new Error('封面只支持 PNG、JPG、WebP 或 GIF')
    }
    if (file.size === 0) {
      throw new Error('封面文件为空')
    }
    if (file.size > COVER_MAX_BYTES) {
      throw new Error('封面图片最大 2MB')
    }
    return file
  })
  .handler(async ({ data: file }) => {
    const { getCoverBucket } = await import('./covers')
    const bucket = getCoverBucket()
    if (!bucket) {
      throw new Error('对象存储未配置')
    }
    const key = `${crypto.randomUUID()}.${COVER_TYPES[file.type]}`
    await bucket.put(key, file, { httpMetadata: { contentType: file.type } })
    return { url: `/covers/${key}` }
  })
