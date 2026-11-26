export const novelStatuses = ['serializing', 'completed', 'paused'] as const

export type NovelStatus = (typeof novelStatuses)[number]

/** 在同一组里上移或下移一位 */
export type MoveDirection = 'up' | 'down'

export const novelStatusLabels: Record<NovelStatus, string> = {
  serializing: '连载中',
  completed: '已完结',
  paused: '断更',
}

export type ChapterSummary = {
  id: string
  title: string
  wordCount: number
  volumeId: string | null
  /** 在全书阅读顺序里的序号，从 1 开始 */
  index: number
}

export type NovelVolumeGroup = {
  id: string
  name: string
  chapters: ChapterSummary[]
}

export type NovelSummary = {
  id: string
  name: string
  author: string | null
  cover: string | null
  status: NovelStatus
  /** 毫秒时间戳 */
  updatedAt: number
  chapterCount: number
  wordCount: number
}

export type NovelDetail = {
  id: string
  name: string
  author: string | null
  cover: string | null
  intro: string | null
  status: NovelStatus
  /** 毫秒时间戳 */
  createdAt: number
  /** 毫秒时间戳 */
  updatedAt: number
  chapterCount: number
  wordCount: number
  volumes: NovelVolumeGroup[]
  /** 没有分卷的章节 */
  looseChapters: ChapterSummary[]
}

export type ChapterContent = {
  novelId: string
  novelName: string
  chapter: {
    id: string
    title: string
    content: string
    wordCount: number
    volumeId: string | null
  }
  /** 在全书阅读顺序里的序号，从 1 开始 */
  index: number
  prevId: string | null
  nextId: string | null
}

/** 阅读顺序：未分卷的章节在前，其后按分卷顺序，组内按章节顺序。 */
export function readingOrder(
  detail: Pick<NovelDetail, 'looseChapters' | 'volumes'>,
): ChapterSummary[] {
  return [...detail.looseChapters, ...detail.volumes.flatMap((volume) => volume.chapters)]
}

/** 字数按非空白字符计，标点也算，与常见阅读平台的口径一致。 */
export function countWords(text: string) {
  // 按码点而不是 UTF-16 单元来数，生僻字和 emoji 才不会被算成两个
  return Array.from(text.replace(/\s/g, '')).length
}

export function formatWords(words: number) {
  return words.toLocaleString('zh-CN')
}
