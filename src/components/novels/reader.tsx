import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, List, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'
import {
  type ChapterContent,
  type ChapterSummary,
  formatWords,
  type NovelDetail,
} from '~/lib/novel-utils'
import { cn } from '~/lib/utils'

const FONT_KEY = 'novel:font-size'
const DEFAULT_FONT = 18
const MIN_FONT = 14
const MAX_FONT = 28

export function Reader({ detail, chapter }: { detail: NovelDetail; chapter: ChapterContent }) {
  const navigate = useNavigate()
  const [tocOpen, setTocOpen] = useState(false)
  const [fontSize, setFontSize] = useState(DEFAULT_FONT)

  // 阅读进度和字号只存在这台设备的浏览器里，所以等挂载之后再读写
  useEffect(() => {
    const saved = Number(localStorage.getItem(FONT_KEY))
    if (saved >= MIN_FONT && saved <= MAX_FONT) {
      setFontSize(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(`novel:last:${detail.id}`, chapter.chapter.id)
    window.scrollTo(0, 0)
  }, [detail.id, chapter.chapter.id])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest('input, textarea, select, [contenteditable]')
      ) {
        return
      }
      const target =
        event.key === 'ArrowLeft'
          ? chapter.prevId
          : event.key === 'ArrowRight'
            ? chapter.nextId
            : null
      if (target) {
        navigate({
          to: '/read/$novelId/$chapterId',
          params: { novelId: detail.id, chapterId: target },
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, detail.id, chapter.prevId, chapter.nextId])

  function changeFont(delta: number) {
    const next = Math.min(MAX_FONT, Math.max(MIN_FONT, fontSize + delta))
    setFontSize(next)
    localStorage.setItem(FONT_KEY, String(next))
  }

  const toc = (
    <nav className='min-h-0 flex-1 space-y-4 overflow-y-auto px-2 pb-6'>
      {detail.looseChapters.length > 0 ? (
        <ChapterList
          novelId={detail.id}
          chapters={detail.looseChapters}
          currentId={chapter.chapter.id}
          onPick={() => setTocOpen(false)}
        />
      ) : null}
      {detail.volumes.map((volume) => (
        <div key={volume.id}>
          <h4 className='px-3 py-1.5 text-xs font-medium text-muted-foreground'>{volume.name}</h4>
          <ChapterList
            novelId={detail.id}
            chapters={volume.chapters}
            currentId={chapter.chapter.id}
            onPick={() => setTocOpen(false)}
          />
        </div>
      ))}
    </nav>
  )

  return (
    <div className='flex min-h-svh flex-col'>
      <header className='sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/80 px-4 backdrop-blur'>
        <div className='flex min-w-0 items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            render={<Link to='/novels/$novelId' params={{ novelId: detail.id }} />}
          >
            <ArrowLeft />
            返回
          </Button>
          <Separator orientation='vertical' className='h-4' />
          <span className='truncate text-sm font-medium'>{detail.name}</span>
        </div>
        <div className='flex shrink-0 items-center gap-1'>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='减小字号'
            title='减小字号'
            disabled={fontSize <= MIN_FONT}
            onClick={() => changeFont(-1)}
          >
            <Minus />
          </Button>
          <span className='w-6 text-center text-xs text-muted-foreground tabular-nums'>
            {fontSize}
          </span>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label='增大字号'
            title='增大字号'
            disabled={fontSize >= MAX_FONT}
            onClick={() => changeFont(1)}
          >
            <Plus />
          </Button>
          <Button variant='outline' size='sm' className='ml-2' onClick={() => setTocOpen(true)}>
            <List />
            目录
          </Button>
        </div>
      </header>

      <main className='mx-auto w-full max-w-3xl flex-1 px-4 py-8'>
        <h1 className='text-xl font-semibold'>{chapter.chapter.title}</h1>
        <p className='mt-1 text-xs text-muted-foreground'>
          第 {chapter.index} 章 · {formatWords(chapter.chapter.wordCount)} 字
        </p>
        <article
          className='mt-6 min-h-[50vh] leading-loose whitespace-pre-wrap text-foreground/90'
          style={{ fontSize }}
        >
          {chapter.chapter.content || '这一章还没有内容。'}
        </article>

        <nav className='mt-10 flex items-center justify-between gap-3'>
          <ChapterButton novelId={detail.id} chapterId={chapter.prevId} label='上一章' />
          <Button variant='outline' size='sm' onClick={() => setTocOpen(true)}>
            <List />
            目录
          </Button>
          <ChapterButton novelId={detail.id} chapterId={chapter.nextId} label='下一章' />
        </nav>
      </main>

      <Sheet open={tocOpen} onOpenChange={setTocOpen}>
        <SheetContent side='left' className='w-80 gap-0 sm:max-w-80'>
          <SheetHeader className='pb-3'>
            <SheetTitle>{detail.name}</SheetTitle>
            <SheetDescription>
              {detail.chapterCount} 章 · {formatWords(detail.wordCount)} 字
            </SheetDescription>
          </SheetHeader>
          {toc}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function ChapterButton({
  novelId,
  chapterId,
  label,
}: {
  novelId: string
  chapterId: string | null
  label: string
}) {
  if (!chapterId) {
    // 占位，让中间的“目录”按钮始终居中
    return <span className='w-20' />
  }
  return (
    <Button
      variant='outline'
      size='sm'
      render={<Link to='/read/$novelId/$chapterId' params={{ novelId, chapterId }} />}
    >
      {label}
    </Button>
  )
}

function ChapterList({
  novelId,
  chapters,
  currentId,
  onPick,
}: {
  novelId: string
  chapters: ChapterSummary[]
  currentId: string
  onPick: () => void
}) {
  return (
    <ul>
      {chapters.map((item) => (
        <li key={item.id}>
          <Link
            to='/read/$novelId/$chapterId'
            params={{ novelId, chapterId: item.id }}
            onClick={onPick}
            aria-current={item.id === currentId ? 'page' : undefined}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-muted',
              item.id === currentId && 'bg-muted font-medium',
            )}
          >
            <span className='w-7 shrink-0 text-right text-xs text-muted-foreground tabular-nums'>
              {item.index}
            </span>
            <span className='truncate'>{item.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
