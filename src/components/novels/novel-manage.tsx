import { Link, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { BookOpen, ChevronDown, ChevronUp, FileUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { ChapterGroup } from '~/components/novels/chapter-group'
import { ConfirmDialog } from '~/components/novels/confirm-dialog'
import { NovelCover } from '~/components/novels/novel-cover'
import { NovelForm } from '~/components/novels/novel-form'
import { TxtImport } from '~/components/novels/txt-import'
import { VolumeForm } from '~/components/novels/volume-form'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  type ChapterSummary,
  formatWords,
  type NovelDetail,
  type NovelVolumeGroup,
  novelStatusLabels,
} from '~/lib/novel-utils'
import { deleteChapter, deleteNovel, deleteVolume, moveChapter, moveVolume } from '~/lib/novels'

const totalWords = (chapters: ChapterSummary[]) =>
  chapters.reduce((total, chapter) => total + chapter.wordCount, 0)

export function NovelManage({ detail }: { detail: NovelDetail }) {
  const router = useRouter()
  const removeChapter = useServerFn(deleteChapter)
  const removeVolume = useServerFn(deleteVolume)
  const removeNovel = useServerFn(deleteNovel)
  const shiftChapter = useServerFn(moveChapter)
  const shiftVolume = useServerFn(moveVolume)

  const [editing, setEditing] = useState(false)
  const [volumeForm, setVolumeForm] = useState<{
    open: boolean
    volume: { id: string; name: string } | null
  }>({ open: false, volume: null })
  const [deletingChapter, setDeletingChapter] = useState<ChapterSummary | null>(null)
  const [deletingVolume, setDeletingVolume] = useState<NovelVolumeGroup | null>(null)
  const [deletingNovel, setDeletingNovel] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  /** 所有会改动数据的操作走这里：统一处理进行中状态、错误提示和刷新。 */
  async function run(key: string, task: () => Promise<unknown>, done?: () => unknown) {
    setBusy(key)
    setError(null)
    try {
      await task()
      await done?.()
      await router.invalidate()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '操作失败')
    } finally {
      setBusy(null)
    }
  }

  function openNewChapter(volumeId?: string) {
    router.navigate({
      to: '/novels/$novelId/chapters/new',
      params: { novelId: detail.id },
      search: volumeId ? { volumeId } : {},
    })
  }

  return (
    <div className='mx-auto w-full max-w-5xl flex-1 space-y-6 p-6'>
      <div className='flex gap-5'>
        <NovelCover src={detail.cover} name={detail.name} className='w-24 shrink-0' />
        <div className='min-w-0 flex-1 space-y-2'>
          <div className='flex flex-wrap items-center gap-2'>
            <h2 className='text-xl font-semibold'>{detail.name}</h2>
            <Badge variant='secondary'>{novelStatusLabels[detail.status]}</Badge>
          </div>
          <p className='text-sm text-muted-foreground'>
            {detail.author ?? '佚名'} · {detail.chapterCount} 章 · {formatWords(detail.wordCount)}{' '}
            字
          </p>
          {detail.intro ? (
            <p className='line-clamp-3 text-sm whitespace-pre-line text-muted-foreground'>
              {detail.intro}
            </p>
          ) : null}
          <div className='flex flex-wrap items-center gap-2 pt-1'>
            <Button size='sm' variant='outline' onClick={() => setEditing(true)}>
              <Pencil />
              编辑
            </Button>
            {detail.chapterCount > 0 ? (
              <Button
                size='sm'
                render={<Link to='/read/$novelId' params={{ novelId: detail.id }} />}
              >
                <BookOpen />
                开始阅读
              </Button>
            ) : null}
            <Button
              size='sm'
              variant='ghost'
              className='text-destructive hover:text-destructive'
              onClick={() => setDeletingNovel(true)}
            >
              <Trash2 />
              删除
            </Button>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <h3 className='text-base font-medium'>分卷与章节</h3>
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setVolumeForm({ open: true, volume: null })}
            >
              <Plus />
              新增分卷
            </Button>
            <Button size='sm' variant='outline' onClick={() => setImportOpen(true)}>
              <FileUp />
              导入 TXT
            </Button>
            <Button size='sm' onClick={() => openNewChapter()}>
              <Plus />
              新增章节
            </Button>
          </div>
        </div>

        {error ? <p className='text-sm text-destructive'>{error}</p> : null}

        {detail.chapterCount === 0 && detail.volumes.length === 0 ? (
          <div className='rounded-xl border border-dashed py-12 text-center'>
            <p className='text-sm font-medium'>还没有章节</p>
            <p className='mt-1 text-sm text-muted-foreground'>
              可以直接新增章节，也可以先建分卷再往卷里加。
            </p>
            <Button className='mt-4' size='sm' onClick={() => openNewChapter()}>
              <Plus />
              新增章节
            </Button>
          </div>
        ) : null}

        {detail.looseChapters.length > 0 ? (
          <ChapterGroup
            novelId={detail.id}
            title='未分卷'
            subtitle={`${detail.looseChapters.length} 章 · ${formatWords(totalWords(detail.looseChapters))} 字`}
            chapters={detail.looseChapters}
            busyId={busy}
            onAddChapter={() => openNewChapter()}
            onMove={(chapterId, direction) =>
              run(`chapter:${chapterId}`, () =>
                shiftChapter({ data: { novelId: detail.id, id: chapterId, direction } }),
              )
            }
            onDelete={setDeletingChapter}
          />
        ) : null}

        {detail.volumes.map((volume, index, volumes) => (
          <ChapterGroup
            key={volume.id}
            novelId={detail.id}
            title={volume.name}
            subtitle={`${volume.chapters.length} 章 · ${formatWords(totalWords(volume.chapters))} 字`}
            chapters={volume.chapters}
            busyId={busy}
            onAddChapter={() => openNewChapter(volume.id)}
            onMove={(chapterId, direction) =>
              run(`chapter:${chapterId}`, () =>
                shiftChapter({ data: { novelId: detail.id, id: chapterId, direction } }),
              )
            }
            onDelete={setDeletingChapter}
            headerActions={
              <>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='上移分卷'
                  title='上移分卷'
                  disabled={index === 0 || busy != null}
                  onClick={() =>
                    run(`volume:${volume.id}`, () =>
                      shiftVolume({
                        data: { novelId: detail.id, id: volume.id, direction: 'up' },
                      }),
                    )
                  }
                >
                  <ChevronUp />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='下移分卷'
                  title='下移分卷'
                  disabled={index === volumes.length - 1 || busy != null}
                  onClick={() =>
                    run(`volume:${volume.id}`, () =>
                      shiftVolume({
                        data: { novelId: detail.id, id: volume.id, direction: 'down' },
                      }),
                    )
                  }
                >
                  <ChevronDown />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='重命名分卷'
                  title='重命名分卷'
                  disabled={busy != null}
                  onClick={() => setVolumeForm({ open: true, volume })}
                >
                  <Pencil />
                </Button>
                <Button
                  variant='ghost'
                  size='icon-xs'
                  aria-label='删除分卷'
                  title='删除分卷'
                  disabled={busy != null}
                  onClick={() => setDeletingVolume(volume)}
                >
                  <Trash2 />
                </Button>
              </>
            }
          />
        ))}
      </div>

      <NovelForm
        open={editing}
        onOpenChange={setEditing}
        novel={detail}
        onSaved={() => router.invalidate()}
      />

      <TxtImport detail={detail} open={importOpen} onOpenChange={setImportOpen} />

      <VolumeForm
        open={volumeForm.open}
        onOpenChange={(open) => setVolumeForm((current) => ({ ...current, open }))}
        novelId={detail.id}
        volume={volumeForm.volume}
        onSaved={() => router.invalidate()}
      />

      <ConfirmDialog
        open={deletingChapter != null}
        onOpenChange={(open) => !open && setDeletingChapter(null)}
        title='删除章节'
        description={`确定删除「${deletingChapter?.title}」？此操作无法撤销。`}
        pending={busy != null}
        onConfirm={() => {
          const chapter = deletingChapter
          if (!chapter) {
            return
          }
          run(`chapter:${chapter.id}`, () =>
            removeChapter({ data: { novelId: detail.id, id: chapter.id } }),
          ).then(() => setDeletingChapter(null))
        }}
      />

      <ConfirmDialog
        open={deletingVolume != null}
        onOpenChange={(open) => !open && setDeletingVolume(null)}
        title='删除分卷'
        description={`确定删除「${deletingVolume?.name}」？卷里的 ${deletingVolume?.chapters.length ?? 0} 章会移到未分卷，不会被删除。`}
        pending={busy != null}
        onConfirm={() => {
          const volume = deletingVolume
          if (!volume) {
            return
          }
          run(`volume:${volume.id}`, () =>
            removeVolume({ data: { novelId: detail.id, id: volume.id } }),
          ).then(() => setDeletingVolume(null))
        }}
      />

      <ConfirmDialog
        open={deletingNovel}
        onOpenChange={setDeletingNovel}
        title='删除小说'
        description={`确定删除《${detail.name}》？它的 ${detail.volumes.length} 个分卷和 ${detail.chapterCount} 章会一起删除，此操作无法撤销。`}
        pending={busy != null}
        onConfirm={() =>
          run(
            'novel',
            () => removeNovel({ data: { id: detail.id } }),
            async () => {
              setDeletingNovel(false)
              await router.navigate({ to: '/novels' })
            },
          )
        }
      />
    </div>
  )
}
