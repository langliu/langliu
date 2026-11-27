import { and, asc, count, desc, eq, isNull, max, sql } from 'drizzle-orm'
import type { BatchItem } from 'drizzle-orm/batch'
import { getDb } from './db'
import type {
  ChapterContent,
  ChapterSummary,
  MoveDirection,
  NovelDetail,
  NovelStatus,
  NovelSummary,
} from './novel-utils'
import { countWords, readingOrder } from './novel-utils'
import { novel, novelChapter, novelVolume } from './schema'

export type NovelInput = {
  name: string
  author?: string | undefined
  cover?: string | undefined
  intro?: string | undefined
  status: NovelStatus
}

export type VolumeInput = { id?: string | undefined; name: string }

export type ChapterInput = {
  novelId: string
  id?: string | undefined
  volumeId: string | null
  title: string
  content: string
}

type Ordered = { id: string; sortOrder: number }

const nextOrder = (highest: number | null) => (highest ?? -1) + 1

/** 章节有增删改时更新小说的“最近更新”时间。 */
async function touch(novelId: string, at: Date) {
  await getDb().update(novel).set({ updatedAt: at }).where(eq(novel.id, novelId))
}

/** 把 id 指的那一项与相邻的一项对调，即在同一组里上移或下移一位。 */
async function swapWithNeighbor(
  rows: Ordered[],
  id: string,
  direction: MoveDirection,
  setOrder: (id: string, sortOrder: number) => BatchItem<'sqlite'>,
) {
  const index = rows.findIndex((row) => row.id === id)
  const target = direction === 'up' ? rows[index - 1] : rows[index + 1]
  if (index < 0 || !target) {
    return
  }
  await getDb().batch([setOrder(id, target.sortOrder), setOrder(target.id, rows[index].sortOrder)])
}

async function exists(query: Promise<{ id: string }[]>) {
  return Boolean((await query)[0])
}

export async function listNovels(): Promise<NovelSummary[]> {
  const rows = await getDb()
    .select({
      id: novel.id,
      name: novel.name,
      author: novel.author,
      cover: novel.cover,
      status: novel.status,
      updatedAt: novel.updatedAt,
      chapterCount: count(novelChapter.id),
      wordCount: sql<number>`coalesce(sum(${novelChapter.wordCount}), 0)`,
    })
    .from(novel)
    .leftJoin(novelChapter, eq(novelChapter.novelId, novel.id))
    .groupBy(novel.id)
    .orderBy(desc(novel.updatedAt), asc(novel.name))
  return rows.map((row) => ({
    ...row,
    updatedAt: row.updatedAt.getTime(),
    wordCount: Number(row.wordCount),
  }))
}

export async function getNovel(id: string): Promise<NovelDetail | null> {
  const db = getDb()
  const found = (await db.select().from(novel).where(eq(novel.id, id)))[0]
  if (!found) {
    return null
  }
  const [volumes, chapters] = await Promise.all([
    db
      .select({ id: novelVolume.id, name: novelVolume.name })
      .from(novelVolume)
      .where(eq(novelVolume.novelId, id))
      .orderBy(asc(novelVolume.sortOrder), asc(novelVolume.name)),
    db
      .select({
        id: novelChapter.id,
        volumeId: novelChapter.volumeId,
        title: novelChapter.title,
        wordCount: novelChapter.wordCount,
      })
      .from(novelChapter)
      .where(eq(novelChapter.novelId, id))
      .orderBy(asc(novelChapter.sortOrder), asc(novelChapter.title)),
  ])

  const inGroup = (volumeId: string | null): ChapterSummary[] =>
    chapters
      .filter((chapter) => chapter.volumeId === volumeId)
      .map((chapter) => ({ ...chapter, index: 0 }))
  const looseChapters = inGroup(null)
  const groups: NovelDetail['volumes'] = volumes.map((volume) => ({
    id: volume.id,
    name: volume.name,
    chapters: inGroup(volume.id),
  }))
  // 阅读顺序里的序号要等整本书排好之后才能算
  const positions = new Map(
    readingOrder({ looseChapters, volumes: groups }).map((chapter, i) => [chapter.id, i + 1]),
  )
  const numbered = (chapter: ChapterSummary): ChapterSummary => ({
    ...chapter,
    index: positions.get(chapter.id) ?? 0,
  })

  return {
    id: found.id,
    name: found.name,
    author: found.author,
    cover: found.cover,
    intro: found.intro,
    status: found.status,
    createdAt: found.createdAt.getTime(),
    updatedAt: found.updatedAt.getTime(),
    chapterCount: chapters.length,
    wordCount: chapters.reduce((total, chapter) => total + chapter.wordCount, 0),
    volumes: groups.map((group) => ({ ...group, chapters: group.chapters.map(numbered) })),
    looseChapters: looseChapters.map(numbered),
  }
}

export async function createNovel(data: NovelInput): Promise<string> {
  const id = crypto.randomUUID()
  const at = new Date()
  await getDb()
    .insert(novel)
    .values({
      id,
      name: data.name,
      author: data.author || null,
      cover: data.cover || null,
      intro: data.intro || null,
      status: data.status,
      createdAt: at,
      updatedAt: at,
    })
  return id
}

export async function updateNovel(id: string, data: NovelInput): Promise<boolean> {
  const db = getDb()
  if (!(await exists(db.select({ id: novel.id }).from(novel).where(eq(novel.id, id))))) {
    return false
  }
  await db
    .update(novel)
    .set({
      name: data.name,
      author: data.author || null,
      cover: data.cover || null,
      intro: data.intro || null,
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(novel.id, id))
  return true
}

export async function deleteNovel(id: string): Promise<boolean> {
  const db = getDb()
  if (!(await exists(db.select({ id: novel.id }).from(novel).where(eq(novel.id, id))))) {
    return false
  }
  // 不依赖外键级联：删得干净，也不受外键开关影响
  await db.batch([
    db.delete(novelChapter).where(eq(novelChapter.novelId, id)),
    db.delete(novelVolume).where(eq(novelVolume.novelId, id)),
    db.delete(novel).where(eq(novel.id, id)),
  ])
  return true
}

export async function saveVolume(novelId: string, data: VolumeInput): Promise<string | null> {
  const db = getDb()
  if (data.id) {
    const owns = await exists(
      db
        .select({ id: novelVolume.id })
        .from(novelVolume)
        .where(and(eq(novelVolume.novelId, novelId), eq(novelVolume.id, data.id))),
    )
    if (!owns) {
      return null
    }
    await db.update(novelVolume).set({ name: data.name }).where(eq(novelVolume.id, data.id))
    return data.id
  }
  const highest = (
    await db
      .select({ max: max(novelVolume.sortOrder) })
      .from(novelVolume)
      .where(eq(novelVolume.novelId, novelId))
  )[0]?.max
  const id = crypto.randomUUID()
  await db
    .insert(novelVolume)
    .values({ id, novelId, name: data.name, sortOrder: nextOrder(highest) })
  return id
}

/** 删除分卷不删章节：卷里的章节按原顺序挪到未分卷的末尾。 */
export async function deleteVolume(novelId: string, id: string): Promise<boolean> {
  const db = getDb()
  const owns = await exists(
    db
      .select({ id: novelVolume.id })
      .from(novelVolume)
      .where(and(eq(novelVolume.novelId, novelId), eq(novelVolume.id, id))),
  )
  if (!owns) {
    return false
  }
  const moving = await db
    .select({ id: novelChapter.id })
    .from(novelChapter)
    .where(eq(novelChapter.volumeId, id))
    .orderBy(asc(novelChapter.sortOrder))
  const looseHighest = (
    await db
      .select({ max: max(novelChapter.sortOrder) })
      .from(novelChapter)
      .where(and(eq(novelChapter.novelId, novelId), isNull(novelChapter.volumeId)))
  )[0]?.max
  const base = nextOrder(looseHighest)
  const statements: [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]] = [
    db.delete(novelVolume).where(eq(novelVolume.id, id)),
    db.update(novel).set({ updatedAt: new Date() }).where(eq(novel.id, novelId)),
    ...moving.map((chapter, i) =>
      db
        .update(novelChapter)
        .set({ volumeId: null, sortOrder: base + i })
        .where(eq(novelChapter.id, chapter.id)),
    ),
  ]
  await db.batch(statements)
  return true
}

export async function moveVolume(novelId: string, id: string, direction: MoveDirection) {
  const db = getDb()
  const rows = await db
    .select({ id: novelVolume.id, sortOrder: novelVolume.sortOrder })
    .from(novelVolume)
    .where(eq(novelVolume.novelId, novelId))
    .orderBy(asc(novelVolume.sortOrder))
  await swapWithNeighbor(rows, id, direction, (volumeId, sortOrder) =>
    db.update(novelVolume).set({ sortOrder }).where(eq(novelVolume.id, volumeId)),
  )
}

export async function moveChapter(novelId: string, id: string, direction: MoveDirection) {
  const db = getDb()
  const chapter = (
    await db
      .select({ volumeId: novelChapter.volumeId })
      .from(novelChapter)
      .where(and(eq(novelChapter.novelId, novelId), eq(novelChapter.id, id)))
  )[0]
  if (!chapter) {
    return
  }
  // 只在同一组（未分卷或同一卷）里移动，不然挪过去也没有明确的落点
  const rows = await db
    .select({ id: novelChapter.id, sortOrder: novelChapter.sortOrder })
    .from(novelChapter)
    .where(
      and(
        eq(novelChapter.novelId, novelId),
        chapter.volumeId
          ? eq(novelChapter.volumeId, chapter.volumeId)
          : isNull(novelChapter.volumeId),
      ),
    )
    .orderBy(asc(novelChapter.sortOrder))
  await swapWithNeighbor(rows, id, direction, (chapterId, sortOrder) =>
    db.update(novelChapter).set({ sortOrder }).where(eq(novelChapter.id, chapterId)),
  )
}

/** 某一组（未分卷或某一卷）里追加一章时该用的排序值。 */
async function appendOrder(novelId: string, volumeId: string | null) {
  const highest = (
    await getDb()
      .select({ max: max(novelChapter.sortOrder) })
      .from(novelChapter)
      .where(
        and(
          eq(novelChapter.novelId, novelId),
          volumeId ? eq(novelChapter.volumeId, volumeId) : isNull(novelChapter.volumeId),
        ),
      )
  )[0]?.max
  return nextOrder(highest)
}

export async function saveChapter(
  input: ChapterInput,
): Promise<{ id: string; wordCount: number } | null> {
  const db = getDb()
  const at = new Date()
  const wordCount = countWords(input.content)
  const values = {
    volumeId: input.volumeId,
    title: input.title,
    content: input.content,
    wordCount,
    updatedAt: at,
  }

  const existing = input.id
    ? (
        await db
          .select({
            id: novelChapter.id,
            volumeId: novelChapter.volumeId,
            sortOrder: novelChapter.sortOrder,
          })
          .from(novelChapter)
          .where(and(eq(novelChapter.novelId, input.novelId), eq(novelChapter.id, input.id)))
      )[0]
    : undefined
  if (input.id && !existing) {
    return null
  }
  const novelRows = await db.select({ id: novel.id }).from(novel).where(eq(novel.id, input.novelId))
  const volumeRows = input.volumeId
    ? await db
        .select({ id: novelVolume.id })
        .from(novelVolume)
        .where(and(eq(novelVolume.novelId, input.novelId), eq(novelVolume.id, input.volumeId)))
    : [{ id: '' }]
  if (!novelRows[0] || !volumeRows[0]) {
    return null
  }

  if (existing) {
    // 被挪去另一组时排到目标组的末尾，否则保持原来的位置
    const sortOrder =
      existing.volumeId === input.volumeId
        ? existing.sortOrder
        : await appendOrder(input.novelId, input.volumeId)
    await db
      .update(novelChapter)
      .set({ ...values, sortOrder })
      .where(eq(novelChapter.id, existing.id))
    await touch(input.novelId, at)
    return { id: existing.id, wordCount }
  }

  const id = crypto.randomUUID()
  await db.insert(novelChapter).values({
    id,
    novelId: input.novelId,
    ...values,
    sortOrder: await appendOrder(input.novelId, input.volumeId),
    createdAt: at,
  })
  await touch(input.novelId, at)
  return { id, wordCount }
}

export async function deleteChapter(novelId: string, id: string): Promise<boolean> {
  const db = getDb()
  const owns = await exists(
    db
      .select({ id: novelChapter.id })
      .from(novelChapter)
      .where(and(eq(novelChapter.novelId, novelId), eq(novelChapter.id, id))),
  )
  if (!owns) {
    return false
  }
  await db.batch([
    db.delete(novelChapter).where(eq(novelChapter.id, id)),
    db.update(novel).set({ updatedAt: new Date() }).where(eq(novel.id, novelId)),
  ])
  return true
}

export async function getChapter(novelId: string, id: string): Promise<ChapterContent | null> {
  const detail = await getNovel(novelId)
  if (!detail) {
    return null
  }
  const order = readingOrder(detail)
  const index = order.findIndex((chapter) => chapter.id === id)
  const chapter = (
    await getDb()
      .select({
        id: novelChapter.id,
        title: novelChapter.title,
        content: novelChapter.content,
        wordCount: novelChapter.wordCount,
        volumeId: novelChapter.volumeId,
      })
      .from(novelChapter)
      .where(and(eq(novelChapter.novelId, novelId), eq(novelChapter.id, id)))
  )[0]
  if (index < 0 || !chapter) {
    return null
  }
  return {
    novelId,
    novelName: detail.name,
    chapter,
    index: index + 1,
    prevId: order[index - 1]?.id ?? null,
    nextId: order[index + 1]?.id ?? null,
  }
}

/** TXT 导入：按全书现有最大排序值继续往后排，保证新章节接在末尾。 */
export async function importChaptersBatch(
  novelId: string,
  volumeId: string | null,
  chapters: { title: string; content: string }[],
): Promise<number> {
  const db = getDb()
  const novelRows = await db.select({ id: novel.id }).from(novel).where(eq(novel.id, novelId))
  if (!novelRows[0]) {
    throw new Error('小说不存在')
  }
  if (volumeId) {
    const volumeRows = await db
      .select({ id: novelVolume.id })
      .from(novelVolume)
      .where(and(eq(novelVolume.novelId, novelId), eq(novelVolume.id, volumeId)))
    if (!volumeRows[0]) {
      throw new Error('分卷不存在')
    }
  }
  const start =
    (
      await db
        .select({ max: max(novelChapter.sortOrder) })
        .from(novelChapter)
        .where(eq(novelChapter.novelId, novelId))
    )[0]?.max ?? -1
  const at = new Date()
  const statements: [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]] = [
    db.update(novel).set({ updatedAt: at }).where(eq(novel.id, novelId)),
    ...chapters.map((chapter, i) =>
      db.insert(novelChapter).values({
        id: crypto.randomUUID(),
        novelId,
        volumeId,
        title: chapter.title,
        content: chapter.content,
        wordCount: countWords(chapter.content),
        sortOrder: start + 1 + i,
        createdAt: at,
        updatedAt: at,
      }),
    ),
  ]
  await db.batch(statements)
  return chapters.length
}
