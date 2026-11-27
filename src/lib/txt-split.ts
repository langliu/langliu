/**
 * TXT 导入的切分模块。浏览器用它做导入前的即时预览，服务端只做校验和写库，
 * 因此这里必须是纯函数，不碰 DOM 和 Node API（TextDecoder 两边都有）。
 *
 * 设计：对任意 TXT 做到全自动全对是不现实的，所以这里只负责把候选切得
 * 尽量准（规则识别 + 序号单调性过滤 + 多数决），最终由用户在预览里确认。
 */

import { countWords } from './novel-utils'

/** 与 server 端校验保持一致：单章正文上限 */
export const MAX_CHAPTER_CHARS = 300000
/** 一次导入的章节数上限 */
export const MAX_IMPORT_CHAPTERS = 2000
/** 标题行的长度上限：卷、章标题都是短行，长行里的「第X章」几乎都是误匹配 */
const TITLE_MAX_CHARS = 50
/** 兜底按字数切分的默认值 */
export const DEFAULT_SPLIT_SIZE = 5000

/** 章节标题里的中文数字（两 也算 2，〇 也算 0） */
const CN_DIGIT_MAP: Record<string, number> = {
  零: 0,
  〇: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  两: 2,
}

const CN_UNITS = new Set(['十', '百', '千', '万'])

export function decodeTxt(buffer: ArrayBuffer): { text: string; encoding: string } {
  const bytes = new Uint8Array(buffer)
  if (bytes[0] === 0xff && bytes[1] === 0xfe) {
    return { text: new TextDecoder('utf-16le').decode(buffer), encoding: 'utf-16le' }
  }
  if (bytes[0] === 0xfe && bytes[1] === 0xff) {
    return { text: new TextDecoder('utf-16be').decode(buffer), encoding: 'utf-16be' }
  }
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return { text: new TextDecoder('utf-8').decode(bytes.subarray(3)), encoding: 'utf-8' }
  }
  try {
    return { text: new TextDecoder('utf-8', { fatal: true }).decode(buffer), encoding: 'utf-8' }
  } catch {
    return { text: new TextDecoder('gb18030').decode(buffer), encoding: 'gb18030' }
  }
}

/**
 * 「一百零三」「两千五」「十二」「一〇一」「零」→ 数字；
 * 解析不了（带 亿 或混入别的字符）返回 null。
 */
export function cnNum(text: string): number | null {
  if (!text) {
    return null
  }
  let hasUnit = false
  for (const char of text) {
    if (CN_UNITS.has(char)) {
      hasUnit = true
    } else if (!(char in CN_DIGIT_MAP)) {
      return null
    }
  }

  // 纯数字位记法（如「零」「九」「一〇一」「二零二四」）
  if (!hasUnit) {
    let value = 0
    for (const char of text) {
      value = value * 10 + CN_DIGIT_MAP[char]
    }
    return value
  }

  let total = 0
  let section = 0
  let digit = 0
  let lastUnit = 0
  let hadZero = false

  for (const char of text) {
    if (char in CN_DIGIT_MAP) {
      const d = CN_DIGIT_MAP[char]
      if (d === 0) {
        hadZero = true
        digit = 0
      } else {
        digit = d
      }
      continue
    }
    if (char === '十') {
      section += (digit || 1) * 10
      digit = 0
      lastUnit = 10
      hadZero = false
    } else if (char === '百') {
      section += (digit || 1) * 100
      digit = 0
      lastUnit = 100
      hadZero = false
    } else if (char === '千') {
      section += (digit || 1) * 1000
      digit = 0
      lastUnit = 1000
      hadZero = false
    } else if (char === '万') {
      const base = total + section + digit
      total = (base || 1) * 10000
      section = 0
      digit = 0
      lastUnit = 10000
      hadZero = false
    }
  }

  // 口语省略末位单位：「两千五」= 2500，「一百五」= 150，「一万二」= 12000；
  // 中间补了「零」则不缩放：「两千零五」= 2005
  const tail = digit > 0 && !hadZero && lastUnit >= 100 ? digit * (lastUnit / 10) : digit
  return total + section + tail
}

const CHAPTER_PATTERNS = [
  {
    family: 'num' as const,
    label: '第X章（阿拉伯数字）',
    re: /^[\s【[]*第\s*(\d+)\s*([章节回话])(?:[\s】\]:：、._—-]*(.*))?$/,
  },
  {
    family: 'cn' as const,
    label: '第X章（中文数字）',
    re: /^[\s【[]*第\s*([零〇一二三四五六七八九十百千万两]+)\s*([章节回话])(?:[\s】\]:：、._—-]*(.*))?$/,
  },
  {
    family: 'en' as const,
    label: 'Chapter N',
    re: /^[\s【[]*(?:chapter|CHAPTER|Chapter)\s+(\d+)\b(?:[\s】\]:：._—-]*(.*))?$/,
  },
]

const SPECIAL_RE =
  /^[\s【[]*(序|序章|序言|前言|引子|楔子|终章|尾声|后记|跋|大结局|结局|番外[篇集]?)([\s:：、._—-]*(.*))?$/
const VOLUME_RE =
  /^[\s【[]*(?:第\s*([0-9零〇一二三四五六七八九十百千万两]+)\s*卷|卷\s*([0-9零〇一二三四五六七八九十百千万两]+)|(?:Volume|Vol\.?)\s*(\d+))[\s】\]]*[:：、._—-]*\s*(.*)$/

const cleanTitle = (raw: string) =>
  raw
    .replace(/^[\s【[]+|[\s】\]]+$/g, '')
    .trim()
    .slice(0, 200)

type Candidate =
  | {
      kind: 'chapter'
      family: 'num' | 'cn' | 'en' | 'special'
      line: number
      title: string
      num: number | null
    }
  | { kind: 'volume'; line: number; title: string }

function scanCandidates(lines: string[]) {
  const found: Candidate[] = []
  for (const [line, raw] of lines.entries()) {
    const text = raw.trimEnd()
    if (!text.trim() || text.length > TITLE_MAX_CHARS) {
      continue
    }
    const volume = VOLUME_RE.exec(text)
    if (volume) {
      found.push({ kind: 'volume', line, title: cleanTitle(text) })
      continue
    }
    const special = SPECIAL_RE.exec(text)
    if (special) {
      found.push({ kind: 'chapter', family: 'special', line, title: cleanTitle(text), num: null })
      continue
    }
    for (const { family, re } of CHAPTER_PATTERNS) {
      const match = re.exec(text)
      if (!match) {
        continue
      }
      const num = family === 'cn' ? cnNum(match[1]) : Number(match[1])
      if (num === null || Number.isNaN(num)) {
        break
      }
      const rawSubtitle = family === 'en' ? match[2] : match[3]
      const subtitle = rawSubtitle ? cleanTitle(rawSubtitle) : ''
      const label = subtitle ? ` ${subtitle}` : ''
      found.push({
        kind: 'chapter',
        family,
        line,
        title: cleanTitle(`第${match[1]}${family === 'en' ? '章' : match[2]}${label}`),
        num,
      })
      break
    }
  }
  return found
}

/**
 * 多数决加宽容：占多数的编号规则一定是真目录；另一族若也有足够多且成规模
 * 的命中（≥2 条且 ≥ 最大族的 30%，比如分卷后换了个写法），一并保留，
 * 真伪交给序号校验判断。零星的一两条孤例则当作误匹配丢弃。
 */
function dominantFamilies(candidates: Candidate[]) {
  const counts = new Map<string, number>()
  for (const candidate of candidates) {
    if (candidate.kind === 'chapter' && candidate.family !== 'special') {
      counts.set(candidate.family, (counts.get(candidate.family) ?? 0) + 1)
    }
  }
  const max = Math.max(0, ...counts.values())
  return new Set(
    [...counts.entries()]
      .filter(([_, count]) => count >= 2 && count >= max * 0.3)
      .map(([family]) => family),
  )
}

export type SplitChapter = {
  title: string
  content: string
  wordCount: number
  oversized: boolean
}
export type SplitVolume = { name: string; chapters: SplitChapter[] }

export type SplitResult = {
  /** 命中的规则名；null 表示走了兜底切分 */
  rule: string | null
  /** 第一个卷标记之前的章节（阅读顺序在最前） */
  loose: SplitChapter[]
  volumes: SplitVolume[]
  /** 第一个章节标题之前的内容，可能是文件头广告或真正的序言 */
  preamble: string
  preambleWordCount: number
  stats: { matched: number; dropped: number }
  warnings: string[]
}

/**
 * 往前看同卷内最多 3 个带编号章节，判断当前候选是不是正文误匹配出的“向上尖峰”
 * （例如第 10 章正文里出现一行「第1000章再见」，后面紧接着是第 11、12 章）。
 */
function isUpwardSpike(candidates: Candidate[], index: number, prevNum: number, num: number) {
  let checked = 0
  for (let j = index + 1; j < candidates.length && checked < 3; j += 1) {
    const next = candidates[j]
    if (next.kind === 'volume') {
      break
    }
    if (next.num === null) {
      continue
    }
    checked += 1
    if (next.num > prevNum && next.num < num) {
      return true
    }
  }
  return false
}

/** 章号必须大致递增：正文中间冒出的「第3章」（当前已到 800 章）或向上尖峰就是误匹配 */
function filterByOrder(candidates: Candidate[]) {
  const kept: Candidate[] = []
  let prevNum = -1
  let dropped = 0
  for (const [index, candidate] of candidates.entries()) {
    if (candidate.kind === 'volume') {
      prevNum = -1 // 卷内章号可以重置
      kept.push(candidate)
      continue
    }
    if (candidate.num === null) {
      kept.push(candidate)
      continue
    }
    if (candidate.num > prevNum) {
      if (isUpwardSpike(candidates, index, prevNum, candidate.num)) {
        dropped += 1
        continue
      }
      prevNum = candidate.num
      kept.push(candidate)
      continue
    }
    // 十三 上 / 十三（下）：连续同号是真实的两章
    if (candidate.num === prevNum && /[上中下]\s*[）)]?\s*$/.test(candidate.title)) {
      kept.push(candidate)
      continue
    }
    dropped += 1
  }
  return { kept, dropped }
}

function assemble(
  lines: string[],
  candidates: Candidate[],
): Pick<SplitResult, 'loose' | 'volumes' | 'preamble' | 'preambleWordCount'> {
  const loose: SplitChapter[] = []
  const volumes: SplitVolume[] = []
  let current: { name: string; chapters: SplitChapter[] } | null = null
  let preambleEnd = -1

  const make = (title: string, contentLines: string[]): SplitChapter => {
    const content = contentLines.join('\n').trim()
    return {
      title,
      content,
      wordCount: countWords(content),
      oversized: content.length > MAX_CHAPTER_CHARS,
    }
  }

  for (const [i, candidate] of candidates.entries()) {
    const start = candidate.line + 1
    const end = i + 1 < candidates.length ? candidates[i + 1].line : lines.length
    if (preambleEnd < 0) {
      preambleEnd = candidate.line
    }
    if (candidate.kind === 'volume') {
      current = { name: candidate.title, chapters: [] }
      volumes.push(current)
      continue
    }
    const chapter = make(candidate.title, lines.slice(start, end))
    if (current) {
      current.chapters.push(chapter)
    } else {
      loose.push(chapter)
    }
  }

  const preamble = preambleEnd > 0 ? lines.slice(0, preambleEnd).join('\n').trim() : ''
  return {
    loose,
    volumes,
    preamble,
    preambleWordCount: preamble ? countWords(preamble) : 0,
  }
}

/** 无编号文件的兜底：找「短行 + 不以句末标点结尾 + 前一行是空行或段落结束」的行号 */
function shortLineHeuristic(lines: string[]): number[] | null {
  const hits: number[] = []
  for (const [line, raw] of lines.entries()) {
    const text = raw.trim()
    if (
      !text ||
      text.length > 30 ||
      !cleanTitle(text) ||
      /[。！？!?…；;，,、]$/.test(text) ||
      text.endsWith(':') ||
      text.endsWith('：')
    ) {
      continue
    }
    const prev = (lines[line - 1] ?? '').trim()
    if (prev && !/[。！？!?…"'」』]$/.test(prev)) {
      continue
    }
    hits.push(line)
  }
  return hits.length >= 3 ? hits : null
}

function countOversized(result: Pick<SplitResult, 'loose' | 'volumes'>) {
  return [...result.loose, ...result.volumes.flatMap((v) => v.chapters)].filter((c) => c.oversized)
    .length
}

export function splitByLength(text: string, size: number): SplitResult {
  const paragraphs = text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
  const chapters: SplitChapter[] = []
  let buffer: string[] = []
  let length = 0
  const flush = () => {
    if (buffer.length) {
      const content = buffer.join('\n')
      chapters.push({
        title: `第 ${chapters.length + 1} 章`,
        content,
        wordCount: countWords(content),
        oversized: content.length > MAX_CHAPTER_CHARS,
      })
      buffer = []
      length = 0
    }
  }
  for (const paragraph of paragraphs) {
    buffer.push(paragraph)
    length += paragraph.length
    if (length >= size) {
      flush()
    }
  }
  flush()
  const oversized = chapters.filter((c) => c.oversized).length
  return {
    rule: null,
    loose: chapters,
    volumes: [],
    preamble: '',
    preambleWordCount: 0,
    stats: { matched: 0, dropped: 0 },
    warnings: [
      '没有识别到章节标题，已按字数强制切分，标题是自动编号。',
      ...(oversized > 0 ? [`${oversized} 章超过单章 30 万字上限，无法导入，请缩小切分字数。`] : []),
    ],
  }
}

export function splitTxt(text: string, splitSize = DEFAULT_SPLIT_SIZE): SplitResult {
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n')
  const lines = normalized.split('\n')
  const candidates = scanCandidates(lines)
  const families = dominantFamilies(candidates)
  const dominant = [...families].sort((a, b) => {
    const countOf = (f: string) =>
      candidates.filter((c) => c.kind === 'chapter' && c.family === f).length
    return countOf(b) - countOf(a)
  })[0]

  if (dominant) {
    const before = candidates.length
    const inFamily = candidates.filter(
      (candidate) =>
        candidate.kind === 'volume' ||
        (candidate.kind === 'chapter' &&
          (candidate.family === 'special' || families.has(candidate.family))),
    )
    const { kept, dropped } = filterByOrder(inFamily)
    if (kept.some((candidate) => candidate.kind === 'chapter')) {
      const result = assemble(lines, kept)
      const label = CHAPTER_PATTERNS.find((p) => p.family === dominant)?.label ?? null
      const warnings: string[] = []
      // 家族过滤和序号过滤各丢了一部分：家族过滤量 = 候选总数 - 进入序号校验的数量
      const totalDropped = before - inFamily.length + dropped
      if (totalDropped > 0) {
        warnings.push(`已过滤 ${totalDropped} 行疑似误匹配的章节行。`)
      }
      const oversized = countOversized(result)
      if (oversized > 0) {
        warnings.push(
          `${oversized} 章超过单章 30 万字上限，可能是切分失败，建议取消勾选或重新处理。`,
        )
      }
      return {
        ...result,
        rule: label,
        stats: {
          matched: kept.filter((c) => c.kind === 'chapter').length,
          dropped: totalDropped,
        },
        warnings,
      }
    }
  }

  const shortLines = shortLineHeuristic(lines)
  if (shortLines) {
    const candidates: Candidate[] = shortLines.map((line) => ({
      kind: 'chapter',
      family: 'special',
      line,
      title: cleanTitle(lines[line]),
      num: null,
    }))
    const result = assemble(lines, candidates)
    const oversized = countOversized(result)
    return {
      ...result,
      rule: '短行标题（启发式，请在预览里核对）',
      stats: { matched: shortLines.length, dropped: 0 },
      warnings: [
        '没有匹配到「第X章」格式的目录，改用短行启发式识别，请逐条核对标题。',
        ...(oversized > 0
          ? [`${oversized} 章超过单章 30 万字上限，可能是切分失败，建议取消勾选或重新处理。`]
          : []),
      ],
    }
  }

  return splitByLength(normalized, splitSize)
}
