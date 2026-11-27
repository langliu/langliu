import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { FileUp, TriangleAlert } from 'lucide-react'
import { useRef, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import { Switch } from '~/components/ui/switch'
import { formatWords, type NovelDetail } from '~/lib/novel-utils'
import { importChaptersBatch, saveVolume } from '~/lib/novels'
import {
  DEFAULT_SPLIT_SIZE,
  decodeTxt,
  MAX_CHAPTER_CHARS,
  MAX_IMPORT_CHAPTERS,
  type SplitChapter,
  type SplitResult,
  splitTxt,
} from '~/lib/txt-split'

const BATCH_SIZE = 40
const MIN_SPLIT_SIZE = 100

type PreviewItem = { key: string; chapter: SplitChapter }
type PreviewGroup = { key: string; name: string; isVolume: boolean; items: PreviewItem[] }

/** 把切分结果摊平成预览结构，key 用来跟踪勾选状态 */
function toPreview(result: SplitResult): PreviewGroup[] {
  const groups: PreviewGroup[] = []
  if (result.loose.length > 0) {
    groups.push({
      key: 'loose',
      name: '未分卷',
      isVolume: false,
      items: result.loose.map((chapter, i) => ({ key: `loose:${i}`, chapter })),
    })
  }
  result.volumes.forEach((volume, v) => {
    if (volume.chapters.length === 0) {
      return
    }
    groups.push({
      key: `v:${v}`,
      name: volume.name,
      isVolume: true,
      items: volume.chapters.map((chapter, i) => ({ key: `v:${v}:${i}`, chapter })),
    })
  })
  return groups
}

export function TxtImport({
  detail,
  open,
  onOpenChange,
}: {
  detail: NovelDetail
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const createVolume = useServerFn(saveVolume)
  const importBatch = useServerFn(importChaptersBatch)

  const fileInput = useRef<HTMLInputElement>(null)
  const [fileInfo, setFileInfo] = useState<{ name: string; encoding: string } | null>(null)
  const [result, setResult] = useState<SplitResult | null>(null)
  const [groups, setGroups] = useState<PreviewGroup[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [splitSize, setSplitSize] = useState(String(DEFAULT_SPLIT_SIZE))
  const [preambleMode, setPreambleMode] = useState<'drop' | 'keep'>('drop')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<{ imported: number; total: number } | null>(null)

  const reset = () => {
    setFileInfo(null)
    setResult(null)
    setGroups([])
    setSelected(new Set())
    setPreambleMode('drop')
    setError(null)
    setProgress(null)
    if (fileInput.current) {
      fileInput.current.value = ''
    }
  }

  async function onFile(file: File) {
    setError(null)
    try {
      const { text, encoding } = decodeTxt(await file.arrayBuffer())
      const parsedSize = Number(splitSize)
      const size =
        Number.isFinite(parsedSize) && parsedSize > 0
          ? Math.max(MIN_SPLIT_SIZE, Math.floor(parsedSize))
          : DEFAULT_SPLIT_SIZE
      const split = splitTxt(text, size)
      const preview = toPreview(split)
      setFileInfo({ name: file.name, encoding })
      setResult(split)
      setGroups(preview)
      // 超长章节服务端一定会拒收，默认不勾选
      setSelected(
        new Set(
          preview.flatMap((group) =>
            group.items.filter((item) => !item.chapter.oversized).map((item) => item.key),
          ),
        ),
      )
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '读取文件失败')
    }
  }

  function reSplit() {
    if (!fileInput.current?.files?.[0]) {
      return
    }
    onFile(fileInput.current.files[0])
  }

  const selectedItems = groups.flatMap((group) =>
    group.items.filter((item) => selected.has(item.key)),
  )
  const keepPreamble = preambleMode === 'keep' && Boolean(result?.preamble)
  const preambleOversized = Boolean(result && result.preamble.length > MAX_CHAPTER_CHARS)
  const totalChapters = selectedItems.length + (keepPreamble ? 1 : 0)
  const selectedWords =
    selectedItems.reduce((total, item) => total + item.chapter.wordCount, 0) +
    (keepPreamble && result ? result.preambleWordCount : 0)
  const overCap = detail.chapterCount + totalChapters > MAX_IMPORT_CHAPTERS
  const hasOversized =
    selectedItems.some((item) => item.chapter.oversized) || (keepPreamble && preambleOversized)

  async function onImport() {
    if (!result || totalChapters === 0 || overCap || hasOversized) {
      return
    }
    setError(null)
    setProgress({ imported: 0, total: totalChapters })

    let imported = 0
    try {
      // 章节顺序 = 预览顺序：未分卷在前（阅读顺序也在最前），其后各卷
      const queue: { volumeName: string | null; chapters: { title: string; content: string }[] }[] =
        []
      if (keepPreamble && result.preamble) {
        queue.push({
          volumeName: null,
          chapters: [{ title: '序章', content: result.preamble }],
        })
      }
      for (const group of groups) {
        const items = group.items.filter((item) => selected.has(item.key))
        if (items.length === 0) {
          continue
        }
        queue.push({
          volumeName: group.isVolume ? group.name : null,
          chapters: items.map((item) => ({
            title: item.chapter.title,
            content: item.chapter.content,
          })),
        })
      }

      let volumeId: string | null = null
      let currentVolume: string | null | undefined
      let buffer: { title: string; content: string }[] = []

      const flush = async (targetVolume: string | null) => {
        if (buffer.length === 0) {
          return
        }
        for (let i = 0; i < buffer.length; i += BATCH_SIZE) {
          const batch = buffer.slice(i, i + BATCH_SIZE)
          await importBatch({
            data: { novelId: detail.id, volumeId: targetVolume, chapters: batch },
          })
          imported += batch.length
          setProgress({ imported, total: totalChapters })
        }
        buffer = []
      }

      for (const task of queue) {
        if (task.volumeName !== currentVolume) {
          await flush(volumeId)
          currentVolume = task.volumeName
          if (task.volumeName) {
            const saved = await createVolume({
              data: { novelId: detail.id, name: task.volumeName },
            })
            volumeId = saved.id
          } else {
            volumeId = null
          }
        }
        buffer.push(...task.chapters)
        if (buffer.length >= BATCH_SIZE) {
          await flush(volumeId)
        }
      }
      await flush(volumeId)

      await router.invalidate()
      onOpenChange(false)
    } catch (caught) {
      if (imported > 0) {
        await router.invalidate()
      }
      const message = caught instanceof Error ? caught.message : '导入失败'
      setError(
        imported > 0
          ? `已导入 ${imported} 章，后续导入失败（${message}）；请检查目录后再继续，避免重复导入。`
          : message,
      )
    } finally {
      setProgress(null)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (progress) {
          return
        }
        if (!next) {
          reset()
        }
        onOpenChange(next)
      }}
    >
      <SheetContent side='right' className='flex-col gap-0 sm:max-w-lg'>
        <SheetHeader className='pb-3'>
          <SheetTitle>导入 TXT</SheetTitle>
          <SheetDescription>
            自动识别「第X章」目录和分卷，导入前可在下方预览核对。新章节会追加到这本书的末尾。
          </SheetDescription>
        </SheetHeader>

        <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4'>
          <div className='space-y-2'>
            <input
              ref={fileInput}
              type='file'
              accept='.txt,text/plain'
              className='hidden'
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  onFile(file)
                }
              }}
            />
            <Button
              variant='outline'
              className='w-full justify-start'
              disabled={progress != null}
              onClick={() => fileInput.current?.click()}
            >
              <FileUp />
              {fileInfo ? `${fileInfo.name}（${fileInfo.encoding}）` : '选择 .txt 文件'}
            </Button>
            <div className='flex items-center gap-2'>
              <Label htmlFor='txt-split-size' className='shrink-0 text-xs text-muted-foreground'>
                识别不到目录时按字数切分
              </Label>
              <Input
                id='txt-split-size'
                inputMode='numeric'
                className='h-7 w-24 text-xs'
                disabled={progress != null}
                value={splitSize}
                onChange={(event) => setSplitSize(event.target.value)}
              />
              <span className='text-xs text-muted-foreground'>字</span>
              {fileInfo ? (
                <Button size='xs' variant='ghost' onClick={reSplit} disabled={progress != null}>
                  重新识别
                </Button>
              ) : null}
            </div>
          </div>

          {result ? (
            <>
              <div className='space-y-1.5 rounded-lg bg-muted/50 p-3 text-xs'>
                <p>
                  识别方式：<span className='font-medium'>{result.rule ?? '按字数切分'}</span> · 共{' '}
                  {groups.filter((g) => g.isVolume).length} 卷 {totalChapters} 章 · 约{' '}
                  {formatWords(selectedWords)} 字
                </p>
                {result.warnings.map((warning) => (
                  <p key={warning} className='flex items-start gap-1 text-destructive'>
                    <TriangleAlert className='mt-0.5 size-3 shrink-0' />
                    {warning}
                  </p>
                ))}
                {overCap ? (
                  <p className='flex items-start gap-1 text-destructive'>
                    <TriangleAlert className='mt-0.5 size-3 shrink-0' />
                    一本书最多 {MAX_IMPORT_CHAPTERS} 章，当前已选超出上限。
                  </p>
                ) : null}
                {hasOversized ? (
                  <p className='flex items-start gap-1 text-destructive'>
                    <TriangleAlert className='mt-0.5 size-3 shrink-0' />
                    已选内容包含超过 30 万字的章节，请先取消勾选或丢弃超长序章后再导入。
                  </p>
                ) : null}
              </div>

              {result.preamble ? (
                <div className='space-y-2'>
                  <Label className='text-xs text-muted-foreground'>
                    第一个章节之前还有 {formatWords(result.preambleWordCount)} 字内容
                    {preambleOversized ? '（超过单章 30 万字上限，无法保留）' : ''}
                  </Label>
                  <Select<'drop' | 'keep'>
                    value={preambleMode}
                    onValueChange={(value) => value && setPreambleMode(value as 'drop' | 'keep')}
                    items={{ drop: '丢弃', keep: '作为「序章」保留' }}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='drop'>丢弃</SelectItem>
                      <SelectItem value='keep'>作为「序章」保留</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className='space-y-3'>
                {groups.map((group) => {
                  const allOn = group.items.every((item) => selected.has(item.key))
                  return (
                    <div key={group.key}>
                      <div className='flex items-center justify-between gap-2 px-1 py-1'>
                        <span className='truncate text-xs font-medium text-muted-foreground'>
                          {group.name} · {group.items.length} 章
                        </span>
                        <button
                          type='button'
                          className='text-xs text-muted-foreground hover:text-foreground'
                          onClick={() =>
                            setSelected((current) => {
                              const next = new Set(current)
                              for (const item of group.items) {
                                if (allOn) {
                                  next.delete(item.key)
                                } else {
                                  next.add(item.key)
                                }
                              }
                              return next
                            })
                          }
                        >
                          {allOn ? '全不选' : '全选'}
                        </button>
                      </div>
                      <ul className='divide-y rounded-lg bg-card ring-1 ring-foreground/10'>
                        {group.items.map((item) => (
                          <li
                            key={item.key}
                            className='flex items-center gap-3 px-3 py-1.5 text-sm'
                          >
                            <Switch
                              checked={selected.has(item.key)}
                              onCheckedChange={(checked) =>
                                setSelected((current) => {
                                  const next = new Set(current)
                                  if (checked) {
                                    next.add(item.key)
                                  } else {
                                    next.delete(item.key)
                                  }
                                  return next
                                })
                              }
                            />
                            <span className='min-w-0 flex-1 truncate'>{item.chapter.title}</span>
                            {item.chapter.oversized ? (
                              <span className='shrink-0 text-xs text-destructive'>超长</span>
                            ) : (
                              <span className='shrink-0 text-xs text-muted-foreground tabular-nums'>
                                {formatWords(item.chapter.wordCount)} 字
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </>
          ) : null}

          {error ? <p className='text-sm text-destructive'>{error}</p> : null}
          {progress ? (
            <div className='space-y-1'>
              <div className='h-1.5 overflow-hidden rounded-full bg-muted'>
                <div
                  className='h-full rounded-full bg-primary transition-all'
                  style={{ width: `${Math.round((progress.imported / progress.total) * 100)}%` }}
                />
              </div>
              <p className='text-xs text-muted-foreground tabular-nums'>
                正在导入 {progress.imported} / {progress.total} 章…
              </p>
            </div>
          ) : null}
        </div>

        {result ? (
          <SheetFooter className='border-t px-4 py-3'>
            <Button
              onClick={onImport}
              disabled={progress != null || totalChapters === 0 || overCap || hasOversized}
            >
              {progress
                ? `导入中 ${progress.imported}/${progress.total}`
                : `导入 ${totalChapters} 章`}
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
