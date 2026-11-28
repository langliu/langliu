import { Link, useBlocker, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { type FormEvent, useRef, useState } from 'react'

import { ConfirmDialog } from '~/components/novels/confirm-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
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
import { Textarea } from '~/components/ui/textarea'
import { countWords, formatWords, type NovelDetail } from '~/lib/novel-utils'
import { deleteChapter, saveChapter } from '~/lib/novels'

/** 未分卷在下拉里的值；空字符串被 Base UI 用来表示“没有选中项”，不能当普通值用。 */
const NO_VOLUME = 'none'

export function ChapterEditor({
  detail,
  chapter,
  initialVolumeId,
}: {
  detail: NovelDetail
  /** 传入则为编辑已有章节，否则为新建 */
  chapter: {
    id: string
    title: string
    content: string
    wordCount: number
    volumeId: string | null
  } | null
  initialVolumeId?: string | undefined
}) {
  const router = useRouter()
  const save = useServerFn(saveChapter)
  const remove = useServerFn(deleteChapter)
  const [title, setTitle] = useState(chapter?.title ?? '')
  const [content, setContent] = useState(chapter?.content ?? '')
  const [volumeId, setVolumeId] = useState(chapter?.volumeId ?? initialVolumeId ?? NO_VOLUME)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  // 保存或删除成功后是我们自己要离开，这时候不该再弹未保存的提示
  const leaving = useRef(false)

  const words = countWords(content)
  const dirty =
    title !== (chapter?.title ?? '') ||
    content !== (chapter?.content ?? '') ||
    volumeId !== (chapter?.volumeId ?? initialVolumeId ?? NO_VOLUME)
  // 未保存就离开时拦一下：站内跳转弹确认框，关标签页走浏览器的离开提示
  const blocker = useBlocker({
    shouldBlockFn: () => dirty && !leaving.current,
    enableBeforeUnload: () => dirty,
    withResolver: true,
  })

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      await save({
        data: {
          novelId: detail.id,
          id: chapter?.id,
          volumeId: volumeId === NO_VOLUME ? null : volumeId,
          title,
          content,
        },
      })
      leaving.current = true
      await router.invalidate()
      await router.navigate({ to: '/novels/$novelId', params: { novelId: detail.id } })
    } catch (caught) {
      leaving.current = false
      setError(caught instanceof Error ? caught.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  async function onDelete() {
    if (!chapter) {
      return
    }
    setError(null)
    try {
      await remove({ data: { novelId: detail.id, id: chapter.id } })
      leaving.current = true
      await router.invalidate()
      await router.navigate({ to: '/novels/$novelId', params: { novelId: detail.id } })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '删除失败')
    }
  }

  const volumeItems = Object.fromEntries([
    [NO_VOLUME, '未分卷'],
    ...detail.volumes.map((volume) => [volume.id, volume.name]),
  ])

  return (
    <div className='mx-auto w-full max-w-3xl flex-1 space-y-4 p-6'>
      <Link
        to='/novels/$novelId'
        params={{ novelId: detail.id }}
        className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground'
      >
        <ArrowLeft />
        返回《{detail.name}》
      </Link>
      <h2 className='text-xl font-semibold'>{chapter ? '编辑章节' : '新增章节'}</h2>

      <form className='space-y-4' onSubmit={onSubmit}>
        <div className='grid gap-4 sm:grid-cols-[1fr_16rem]'>
          <div className='space-y-2'>
            <Label htmlFor='chapter-title'>标题</Label>
            <Input
              id='chapter-title'
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label>所属分卷</Label>
            <Select<string>
              value={volumeId}
              onValueChange={(value) => value && setVolumeId(value)}
              items={volumeItems}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_VOLUME}>未分卷</SelectItem>
                {detail.volumes.map((volume) => (
                  <SelectItem key={volume.id} value={volume.id}>
                    {volume.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='chapter-content'>正文</Label>
            <span className='text-xs text-muted-foreground tabular-nums'>
              共 {formatWords(words)} 字
            </span>
          </div>
          <Textarea
            id='chapter-content'
            className='field-sizing-fixed min-h-[60vh] resize-y leading-7'
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>

        {error ? <p className='text-sm text-destructive'>{error}</p> : null}

        <div className='flex items-center justify-between'>
          {chapter ? (
            <Button
              type='button'
              variant='ghost'
              className='text-destructive hover:text-destructive'
              onClick={() => setConfirmingDelete(true)}
            >
              <Trash2 />
              删除章节
            </Button>
          ) : (
            <span />
          )}
          <Button type='submit' disabled={pending}>
            {pending ? '保存中…' : '保存'}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title='删除章节'
        description={`确定删除「${chapter?.title ?? ''}」？此操作无法撤销。`}
        onConfirm={() => {
          setConfirmingDelete(false)
          onDelete()
        }}
      />

      <AlertDialog
        open={blocker.status === 'blocked'}
        onOpenChange={(open) => {
          if (!open && blocker.status === 'blocked') {
            blocker.reset()
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>有未保存的更改</AlertDialogTitle>
            <AlertDialogDescription>
              这一章的修改还没有保存，离开后会丢失。要放弃更改并离开吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (blocker.status === 'blocked') {
                  blocker.reset()
                }
              }}
            >
              留在页面
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (blocker.status !== 'blocked') {
                  return
                }
                leaving.current = true
                blocker.proceed()
              }}
            >
              放弃更改并离开
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
