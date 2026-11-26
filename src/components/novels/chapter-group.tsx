import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { type ChapterSummary, formatWords, type MoveDirection } from '~/lib/novel-utils'

/** 一组章节（未分卷或某一卷）的列表，带排序和删除操作。 */
export function ChapterGroup({
  novelId,
  title,
  subtitle,
  chapters,
  headerActions,
  busyId,
  onAddChapter,
  onMove,
  onDelete,
}: {
  novelId: string
  title: string
  subtitle: string
  chapters: ChapterSummary[]
  /** 分卷自己的操作，未分卷没有 */
  headerActions?: ReactNode
  /** 正在处理中的章节 id，用来避免重复点击 */
  busyId: string | null
  onAddChapter: () => void
  onMove: (chapterId: string, direction: MoveDirection) => void
  onDelete: (chapter: ChapterSummary) => void
}) {
  return (
    <section className='rounded-xl bg-card ring-1 ring-foreground/10'>
      <header className='flex items-center justify-between gap-3 px-4 py-3'>
        <div className='flex min-w-0 items-baseline gap-2'>
          <h4 className='truncate font-medium'>{title}</h4>
          <span className='shrink-0 text-muted-foreground text-xs'>{subtitle}</span>
        </div>
        <div className='flex shrink-0 items-center gap-1'>
          {headerActions}
          <Button size='xs' variant='outline' onClick={onAddChapter}>
            <Plus />
            章节
          </Button>
        </div>
      </header>

      {chapters.length === 0 ? (
        <p className='border-t px-4 py-6 text-muted-foreground text-sm'>这一组还没有章节。</p>
      ) : (
        <ul className='divide-y'>
          {chapters.map((chapter, index) => (
            <li
              key={chapter.id}
              className='group flex items-center gap-3 px-4 py-1.5 transition-colors hover:bg-muted/50'
            >
              <span className='w-8 shrink-0 text-right text-muted-foreground text-xs tabular-nums'>
                {chapter.index}
              </span>
              <Link
                to='/novels/$novelId/chapters/$chapterId'
                params={{ novelId, chapterId: chapter.id }}
                className='min-w-0 flex-1 truncate text-sm hover:underline'
              >
                {chapter.title}
              </Link>
              <span className='shrink-0 text-muted-foreground text-xs tabular-nums'>
                {formatWords(chapter.wordCount)} 字
              </span>
              {/* 触屏没有悬停，所以只在宽屏上收起操作按钮 */}
              <div className='flex shrink-0 items-center md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100'>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='上移'
                  title='上移'
                  disabled={index === 0 || busyId != null}
                  onClick={() => onMove(chapter.id, 'up')}
                >
                  <ChevronUp />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='下移'
                  title='下移'
                  disabled={index === chapters.length - 1 || busyId != null}
                  onClick={() => onMove(chapter.id, 'down')}
                >
                  <ChevronDown />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='编辑'
                  title='编辑'
                  render={
                    <Link
                      to='/novels/$novelId/chapters/$chapterId'
                      params={{ novelId, chapterId: chapter.id }}
                    />
                  }
                >
                  <Pencil />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='删除'
                  title='删除'
                  disabled={busyId != null}
                  onClick={() => onDelete(chapter)}
                >
                  <Trash2 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
